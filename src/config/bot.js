import discord
from discord.ext import commands
from discord.ui import View, Button
from discord import app_commands
import datetime
import asyncio
import json
import os

# --- ⚙️ CONFIGURACIÓN ---
TOKEN = 'MTUyMjQzNTQzNDU1MzE1MTU4MQ.Gyrg4H.LWs13699P0msGGCeHRAmNLNscK3l1CeSpo_nwU'
TU_ID_DE_USUARIO = 1467817780345835571
TEST_GUILD_ID = 1491616059244023921

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix='!', intents=intents)

# Variables de memoria
mensaje_lista_viva = None
mensaje_aviso_cerrado = None
view_actual = None
id_categoria_tickets = 1492048003748331550

# Staff Roles
ARCHIVO_STAFF = "staff_roles.json"
staff_roles = []

def cargar_staff_roles():
    global staff_roles
    if os.path.exists(ARCHIVO_STAFF):
        with open(ARCHIVO_STAFF, 'r') as f:
            try:
                staff_roles = json.load(f)
            except:
                staff_roles = []
    else:
        staff_roles = []

def guardar_staff_roles():
    with open(ARCHIVO_STAFF, 'w') as f:
        json.dump(staff_roles, f, indent=4)

def es_staff(member: discord.Member) -> bool:
    if not staff_roles:
        return member.guild_permissions.administrator
    return any(role.id in staff_roles for role in member.roles)

# ==================== COOLDOWN ====================
DIAS_COOLDOWN = 7
ARCHIVO_COOLDOWN = "cooldowns.json"

def consultar_cooldown(usuario_id):
    if not os.path.exists(ARCHIVO_COOLDOWN):
        return False, None
    try:
        with open(ARCHIVO_COOLDOWN, 'r') as f:
            data = json.load(f)
    except:
        return False, None
    
    fecha_test_str = data.get(str(usuario_id))
    if not fecha_test_str:
        return False, None
    
    fecha_test = datetime.datetime.fromisoformat(fecha_test_str)
    fecha_fin = fecha_test + datetime.timedelta(days=DIAS_COOLDOWN)
    ahora = datetime.datetime.now(datetime.timezone.utc)
    
    if ahora < fecha_fin:
        return True, (fecha_fin - ahora)
    return False, None

def aplicar_cooldown(usuario_id):
    """Aplica cooldown de 7 días al usuario (se llama desde /subir)"""
    try:
        with open(ARCHIVO_COOLDOWN, 'r') as f:
            data = json.load(f)
    except:
        data = {}
    
    ahora = datetime.datetime.now(datetime.timezone.utc)
    data[str(usuario_id)] = ahora.isoformat()
    
    with open(ARCHIVO_COOLDOWN, 'w') as f:
        json.dump(data, f, indent=4)

# ==========================================
# QUEUE CLASS (Botón Join Queue)
# ==========================================
class StellarQueue(View):
    def __init__(self, tester_mencion):
        super().__init__(timeout=None)
        self.participantes = []
        self.testers_activos = [tester_mencion]
        self.update_task = None

    async def start_auto_update(self):
        if self.update_task is None or self.update_task.done():
            self.update_task = asyncio.create_task(self.auto_update_loop())

    async def auto_update_loop(self):
        while True:
            await asyncio.sleep(30)
            if not mensaje_lista_viva:
                break
            try:
                await self.actualizar_embed()
            except:
                break

    async def actualizar_embed(self, interaction: discord.Interaction = None):
        lista_txt = ("La cola está vacía. ¡Sé el primero!" if not self.participantes
                     else "\n".join(f"{i+1}. {usuario.mention}" for i, usuario in enumerate(self.participantes)))
       
        testers_txt = "\n".join(f"{i+1}. {tester}" for i, tester in enumerate(self.testers_activos))
       
        embed = discord.Embed(
            title="Stellar Tierlist",
            description="**Tester Available!**\n\nPresiona el botón para unirte a la fila.",
            color=discord.Color.from_rgb(100, 149, 237)
        )
        if bot.user.avatar:
            embed.set_thumbnail(url=bot.user.avatar.url)
       
        embed.add_field(name=f"Queue ({len(self.participantes)}/20):", value=lista_txt, inline=False)
        embed.add_field(name=f"Active Testers ({len(self.testers_activos)}):", value=testers_txt, inline=False)
        embed.set_footer(text="Staff: /jointest | Usuarios: /leave")
        
        global mensaje_lista_viva
        try:
            if interaction and not interaction.response.is_done():
                await interaction.response.edit_message(embed=embed, view=self)
            elif mensaje_lista_viva:
                await mensaje_lista_viva.edit(embed=embed, view=self)
        except discord.NotFound:
            self.update_task = None
        except Exception:
            pass

    @discord.ui.button(label="Join Queue", style=discord.ButtonStyle.blurple, custom_id="persistent_join_stellar")
    async def unirse(self, interaction: discord.Interaction, button: Button):
        en_cooldown, tiempo_restante = consultar_cooldown(interaction.user.id)
        if en_cooldown:
            dias = tiempo_restante.days
            horas, rem = divmod(tiempo_restante.seconds, 3600)
            minutos, _ = divmod(rem, 60)
            return await interaction.response.send_message(
                f"❌ **Tienes cooldown activo.**\n"
                f"Faltan: **{dias}d {horas}h {minutos}m** aproximadamente.\n"
                f"Podrás volver a hacer test en **{DIAS_COOLDOWN} días**.",
                ephemeral=True
            )

        if interaction.user in self.participantes:
            return await interaction.response.send_message("Ya estás en la cola.", ephemeral=True)

        if len(self.participantes) >= 20:
            return await interaction.response.send_message("❌ La cola está llena (20/20).", ephemeral=True)

        self.participantes.append(interaction.user)

        if len(self.participantes) == 1:
            try:
                await interaction.user.send("🎉 **¡Estás en el Top 1!** Espera a que un tester te llame.")
            except:
                pass

        await self.actualizar_embed(interaction)


# ==========================================
# COMANDOS
# ==========================================

@bot.hybrid_command(name="sync", description="Sincroniza comandos slash")
async def sync(ctx: commands.Context):
    if ctx.author.id != TU_ID_DE_USUARIO:
        return await ctx.send("❌ Solo el dueño puede usar esto.", ephemeral=True)

    await ctx.send("🔄 Limpiando y sincronizando comandos...")

    try:
        guild = discord.Object(id=TEST_GUILD_ID)
        bot.tree.clear_commands(guild=guild)
        synced = await bot.tree.sync(guild=guild)
        await ctx.send(f"✅ **{len(synced)}** comandos sincronizados.")
        print(f"Comandos sincronizados: {[cmd.name for cmd in synced]}")
    except Exception as e:
        await ctx.send(f"❌ Error: {e}")


# ====================== COMANDOS TESTERS ======================
@bot.tree.command(name="abrir", description="Abre una nueva cola de tests")
async def slash_abrir(interaction: discord.Interaction):
    await abrir_nueva_cola(interaction)

@bot.tree.command(name="jointest", description="Únete como tester adicional")
async def slash_jointest(interaction: discord.Interaction):
    await unirse_como_tester(interaction)

@bot.tree.command(name="leavetest", description="Salir de la lista de testers activos")
async def slash_leavetest(interaction: discord.Interaction):
    await salir_como_tester(interaction)


async def abrir_nueva_cola(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)

    global mensaje_lista_viva, mensaje_aviso_cerrado, view_actual

    if mensaje_aviso_cerrado:
        try: await mensaje_aviso_cerrado.delete()
        except: pass
    if mensaje_lista_viva:
        try: await mensaje_lista_viva.delete()
        except: pass

    view_actual = StellarQueue(interaction.user.mention)

    embed = discord.Embed(
        title="Stellar Tierlist",
        description="**Tester Available!**\n\nPresiona el botón para unirte a la fila.",
        color=discord.Color.blue()
    )
    embed.add_field(name="Queue (0/20):", value="La cola está vacía.", inline=False)
    embed.add_field(name="Active Testers:", value=f"1. {interaction.user.mention}", inline=False)

    mensaje_lista_viva = await interaction.followup.send(
        "@here",
        embed=embed,
        view=view_actual,
        allowed_mentions=discord.AllowedMentions(everyone=True)
    )

    await view_actual.start_auto_update()


async def unirse_como_tester(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)

    global view_actual
    if not view_actual:
        return await interaction.followup.send("❌ No hay ninguna cola abierta.", ephemeral=True)

    if interaction.user.mention in view_actual.testers_activos:
        return await interaction.followup.send("❌ Ya estás como tester activo.", ephemeral=True)

    view_actual.testers_activos.append(interaction.user.mention)
    await view_actual.actualizar_embed()
    await interaction.followup.send(f"✅ Te has unido. Testers activos: **{len(view_actual.testers_activos)}**", ephemeral=True)


async def salir_como_tester(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)

    global view_actual
    if not view_actual:
        return await interaction.followup.send("❌ No hay ninguna cola abierta.", ephemeral=True)

    if interaction.user.mention not in view_actual.testers_activos:
        return await interaction.followup.send("❌ No estás en la lista de testers activos.", ephemeral=True)

    if len(view_actual.testers_activos) <= 1:
        return await interaction.followup.send("❌ No puedes salir, eres el único tester activo.", ephemeral=True)

    view_actual.testers_activos.remove(interaction.user.mention)
    await view_actual.actualizar_embed()
    await interaction.followup.send(f"✅ Has salido correctamente. Ahora hay **{len(view_actual.testers_activos)}** testers.", ephemeral=True)


@bot.tree.command(name="next", description="Saca al siguiente de la fila")
async def slash_next(interaction: discord.Interaction):
    await interaction.response.defer()
    global view_actual, id_categoria_tickets

    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)

    if not view_actual or not view_actual.participantes:
        return await interaction.followup.send("❌ No hay nadie en la cola.", ephemeral=True)

    if not id_categoria_tickets:
        return await interaction.followup.send("❌ Configura la categoría con /setcategory", ephemeral=True)

    usuario_test = view_actual.participantes.pop(0)

    try:
        categoria = bot.get_channel(id_categoria_tickets)
        overwrites = {
            interaction.guild.default_role: discord.PermissionOverwrite(view_channel=False),
            usuario_test: discord.PermissionOverwrite(view_channel=True, send_messages=True, read_message_history=True),
            interaction.user: discord.PermissionOverwrite(view_channel=True, send_messages=True, read_message_history=True)
        }

        ticket_canal = await interaction.guild.create_text_channel(
            name=f"test-{usuario_test.name}",
            category=categoria,
            overwrites=overwrites
        )

        await ticket_canal.send(f"🏆 {usuario_test.mention}, bienvenido. El tester {interaction.user.mention} está listo.\nUsa /test o /close.")

        if len(view_actual.participantes) > 0:
            try:
                await view_actual.participantes[0].send("🎉 **Atención! Ahora estás en el Top 1.**")
            except:
                pass

        await view_actual.actualizar_embed()
        await interaction.followup.send(f"✅ Canal creado: {ticket_canal.mention}")

    except Exception as e:
        await interaction.followup.send(f"❌ Error: {e}")

# ==================== COMANDO /SUBIR (AQUÍ SE APLICA EL COOLDOWN) ====================
@bot.tree.command(name="subir", description="Sube el resultado del test")
@app_commands.describe(
    region="Región", 
    modalidad="Modalidad", 
    rol_viejo="Rol anterior", 
    rol_nuevo="Rol nuevo", 
    miembro="Miembro", 
    nombre_mc="Nombre MC"
)
async def slash_subir(
    interaction: discord.Interaction, 
    region: str, 
    modalidad: str, 
    rol_viejo: discord.Role, 
    rol_nuevo: discord.Role, 
    miembro: discord.Member, 
    nombre_mc: str
):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
   
    # === APLICAR COOLDOWN AL USUARIO QUE FUE TESTEADO ===
    aplicar_cooldown(miembro.id)

    try:
        await miembro.remove_roles(rol_viejo)
        await miembro.add_roles(rol_nuevo)
    except:
        pass
   
    embed = discord.Embed(title="RESULTADO DEL TEST 🏆", color=0xFF4500, timestamp=datetime.datetime.now())
    embed.set_thumbnail(url=f"https://minotar.net/armor/body/{nombre_mc}/100.png")
    embed.add_field(name="TESTER:", value=interaction.user.mention, inline=False)
    embed.add_field(name="REGION:", value=region.upper(), inline=False)
    embed.add_field(name="NOMBRE DE USUARIO:", value=nombre_mc, inline=False)
    embed.add_field(name="MODALIDAD:", value=modalidad, inline=False)
    embed.add_field(name="RANGO ANTERIOR:", value=f"{rol_viejo.mention} || {rol_viejo.name}", inline=False)
    embed.add_field(name="RANGO OBTENIDO:", value=f"{rol_nuevo.mention} || {rol_nuevo.name}", inline=False)
    embed.set_footer(text="Stellar TierList.")
   
    await interaction.followup.send(content=f"{miembro.mention}", embed=embed)

# Resto de comandos (sin cambios importantes)
@bot.tree.command(name="cerrar", description="Cierra la cola de tests temporalmente")
async def slash_cerrar(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
   
    global mensaje_lista_viva, mensaje_aviso_cerrado, view_actual
    if mensaje_lista_viva:
        try: await mensaje_lista_viva.delete()
        except: pass
   
    mensaje_lista_viva = None
    view_actual = None
   
    embed = discord.Embed(title="Stellar Tierlist", color=discord.Color.red())
    embed.add_field(name="Queue Cerrada Temporalmente 🚫", value="No hay testers disponibles.")
    mensaje_aviso_cerrado = await interaction.followup.send(embed=embed)

@bot.tree.command(name="setcategory", description="Configura categoría de tickets")
@app_commands.describe(category_id="ID de la categoría")
async def slash_setcategory(interaction: discord.Interaction, category_id: int):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
   
    global id_categoria_tickets
    id_categoria_tickets = category_id
    await interaction.followup.send(f"✅ Categoría configurada: **{category_id}**")

@bot.tree.command(name="test", description="Envía la plantilla de información")
async def slash_test(interaction: discord.Interaction):
    if not es_staff(interaction.user):
        return await interaction.response.send_message("❌ No tienes permiso.", ephemeral=True)
    await interaction.response.send_message("Region: | Nametag: | Server:")

@bot.tree.command(name="close", description="Cierra el canal actual")
async def slash_close(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
    await interaction.followup.send("Cerrando en 3 segundos...")
    await asyncio.sleep(3)
    await interaction.channel.delete()

@bot.tree.command(name="leave", description="Salir de la cola de tests")
async def slash_leave(interaction: discord.Interaction):
    await interaction.response.defer()
    global view_actual
    if not view_actual:
        return await interaction.followup.send("❌ No hay ninguna cola abierta.", ephemeral=True)
   
    if interaction.user in view_actual.participantes:
        view_actual.participantes.remove(interaction.user)
        await view_actual.actualizar_embed()
        await interaction.followup.send("✅ Has salido de la cola correctamente.", ephemeral=True)
    else:
        await interaction.followup.send("No estabas en la cola.", ephemeral=True)

@bot.tree.command(name="setstaffrole", description="Añade un rol como Staff")
@app_commands.describe(role="Rol que tendrá permisos de Staff")
async def slash_setstaffrole(interaction: discord.Interaction, role: discord.Role):
    await interaction.response.defer(ephemeral=True)
    if interaction.user.id != TU_ID_DE_USUARIO:
        return await interaction.followup.send("❌ Solo el dueño del bot puede usar este comando.", ephemeral=True)
   
    global staff_roles
    if role.id in staff_roles:
        await interaction.followup.send(f"❌ El rol **{role.name}** ya está configurado como Staff.", ephemeral=True)
        return
   
    staff_roles.append(role.id)
    guardar_staff_roles()
    await interaction.followup.send(f"✅ El rol **{role.name}** ha sido añadido como Staff.", ephemeral=True)

@bot.tree.command(name="staffmembers", description="Muestra los roles de staff")
async def slash_staffmembers(interaction: discord.Interaction):
    await interaction.response.defer()
    if not staff_roles:
        return await interaction.followup.send("Aún no hay roles de staff configurados.")
   
    txt = "\n".join(f"• <@&{rid}>" for rid in staff_roles)
    embed = discord.Embed(title="Roles de Staff", description=txt, color=discord.Color.gold())
    await interaction.followup.send(embed=embed)

@bot.tree.command(name="tiempo", description="Ver cooldown de un usuario")
async def slash_tiempo(interaction: discord.Interaction, miembro: discord.Member = None):
    objetivo = miembro or interaction.user
    en_cooldown, t = consultar_cooldown(objetivo.id)
    if en_cooldown:
        dias = t.days
        horas, rem = divmod(t.seconds, 3600)
        minutos, _ = divmod(rem, 60)
        await interaction.response.send_message(f"⏳ {objetivo.mention} tiene cooldown.\nFaltan: **{dias}d {horas}h {minutos}m**")
    else:
        await interaction.response.send_message(f"✅ {objetivo.mention} no tiene cooldown activo.")

# ==========================================
# ON_READY
# ==========================================
@bot.event
async def on_ready():
    print(f'✅ Stellar Bot Online - {bot.user}')
    cargar_staff_roles()
    print("✅ Roles de staff cargados")
   
    if not os.path.exists(ARCHIVO_COOLDOWN):
        with open(ARCHIVO_COOLDOWN, 'w') as f:
            json.dump({}, f)
    print("🚀 Bot listo. Ejecuta /sync ahora.")

    # === IMPORTANTE: Sincronizar comandos automáticamente al iniciar ===
    try:
        guild = discord.Object(id=TEST_GUILD_ID)
        synced = await bot.tree.sync(guild=guild)
        print(f"✅ {len(synced)} comandos slash sincronizados automáticamente.")
    except Exception as e:
        print(f"❌ Error al sincronizar automáticamente: {e}")

bot.run(TOKEN)
