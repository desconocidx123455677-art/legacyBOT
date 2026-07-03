import { logger } from '../utils/logger.js';

export const botConfig = {
  // =========================
  // BOT PRESENCE (what users see under the bot name)
  // =========================
  // `status` options:
  // - "online"    = green dot
  // - "idle"      = yellow moon
  // - "dnd"       = red do-not-disturb
  // - "invisible" = appears offline
  presence: {
    // Current online state shown on Discord.
    status: "online",

    // Activity lines shown under the bot name.
    // `type` number mapping from Discord:
    // 0 = Playing
    // 1 = Streaming
    // 2 = Listening
    // 3 = Watching
    // 4 = Custom
    // 5 = Competing
    activities: [
      {
        // Text users will see (example: "Playing /help | Titan Bot").
        name: "Made with ❤️",
        // Activity type number (0 = Playing).
        type: 0,
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    // Bot owner user IDs (comma-separated in OWNER_IDS env var).
    // Owners can access owner/admin-level bot commands.
    owners: process.env.OWNER_IDS?.split(",") || [],

    // Default wait time between command uses (in seconds).
    defaultCooldown: 3,

    // If true, old commands are removed before re-registering.
    deleteCommands: false,

    // Optional server ID used for testing slash commands quickly.
    testGuildId: process.env.TEST_GUILD_ID,

    // Command prefix for text-based commands (e.g., "!" for "!ping").
    // Supports both slash commands and prefix commands.
    prefix: process.env.PREFIX || "!",
  },

  // =========================
  // APPLICATIONS SYSTEM
  // =========================
  applications: {
    // Default questions shown when someone fills out an application.
    defaultQuestions: [
      { question: "What is your name?", required: true },
      { question: "How old are you?", required: true },
      { question: "Why do you want to join?", required: true },
    ],

    // Embed colors by application status.
    statusColors: {
      pending: "#FFA500",
      approved: "#00FF00",
      denied: "#FF0000",
    },

    // How long users must wait before submitting another application (hours).
    applicationCooldown: 24,

    // Auto-delete denied applications after this many days.
    deleteDeniedAfter: 7,

    // Auto-delete approved applications after this many days.
    deleteApprovedAfter: 30,

    // Role IDs allowed to manage applications.
    managerRoles: [], // Will be populated from environment or database
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  // IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all bot colors
  embeds: {
    colors: {
      // Main brand colors.
      primary: "#336699",
      secondary: "#2F3136",

      // Standard status colors for success/error/warning/info messages.
      success: "#57F287",
      error: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",

      // Neutral utility colors.
      light: "#FFFFFF",
      dark: "#202225",
      gray: "#99AAB5",

      // Discord-style palette shortcuts.
      blurple: "#5865F2",
      green: "#57F287",
      yellow: "#FEE75C",
      fuchsia: "#EB459E",
      red: "#ED4245",
      black: "#000000",

      // Feature-specific colors.
      giveaway: {
        active: "#57F287",
        ended: "#ED4245",
      },
      ticket: {
        open: "#57F287",
        claimed: "#FAA61A",
        closed: "#ED4245",
        pending: "#99AAB5",
      },
      economy: "#F1C40F",
      birthday: "#E91E63",
      moderation: "#9B59B6",

      // Ticket priority color mapping.
      priority: {
        none: "#95A5A6",
        low: "#3498db",
        medium: "#2ecc71",
        high: "#f1c40f",
        urgent: "#e74c3c",
      },
    },
    footer: {
      // Default footer text used in bot embeds.
      text: "Titan Bot",
      // Footer icon URL (null = no icon).
      icon: null,
    },
    // Default thumbnail URL for embeds (null = no thumbnail).
    thumbnail: null,
    author: {
      // Optional default embed author block.
      name: null,
      icon: null,
      url: null,
    },
  },

  // =========================
  // ECONOMY SETTINGS
  // =========================
  economy: {
    currency: {
      // Currency display name.
      name: "coins",
      // Plural display name.
      namePlural: "coins",
      // Currency symbol shown in balances.
      symbol: "$",
    },

    // Starting balance for new users.
    startingBalance: 0,

    // Maximum bank amount before upgrades (if upgrades are used).
    baseBankCapacity: 100000,

    // Daily reward amount.
    dailyAmount: 100,

    // Work command random payout range.
    workMin: 10,
    workMax: 100,

    // Beg command random payout range.
    begMin: 5,
    begMax: 50,

    // Chance to succeed when robbing (0.4 = 40%).
    robSuccessRate: 0.4,

    // Jail time after failed rob (milliseconds).
    // 3600000 = 1 hour.
    robFailJailTime: 3600000,
  },

  // =========================
  // SHOP SETTINGS
  // =========================
  // Add shop defaults here when needed.
  shop: {

  },

  // =========================
  // TICKET SYSTEM
  // =========================
  tickets: {
    // Category ID where new tickets are created (null = no forced category).
    defaultCategory: null,

    // Role IDs allowed to manage/support tickets.
    supportRoles: [],

    // Priority options users/staff can assign.
    priorities: {
      none: {
        emoji: "⚪",
        color: "#95A5A6",
        label: "None",
      },
      low: {
        emoji: "🟢",
        color: "#2ECC71",
        label: "Low",
      },
      medium: {
        emoji: "🟡",
        color: "#F1C40F",
        label: "Medium",
      },
      high: {
        emoji: "🔴",
        color: "#E74C3C",
        label: "High",
      },
      urgent: {
        emoji: "🚨",
        color: "#E91E63",
        label: "Urgent",
      },
    },

    // Default priority for new tickets.
    defaultPriority: "none",

    // Category ID where closed tickets are archived.
    archiveCategory: null,

    // Channel ID where ticket logs are sent.
    logChannel: null,
  },

  // =========================
  // GIVEAWAY SETTINGS
  // =========================
  giveaways: {
    // Default giveaway duration in milliseconds.
    // 86400000 = 24 hours.
    defaultDuration: 86400000,

    // Allowed winner count range.
    minimumWinners: 1,
    maximumWinners: 10,

    // Allowed giveaway duration range in milliseconds.
    // 300000 = 5 minutes.
    minimumDuration: 300000,
    // 2592000000 = 30 days.
    maximumDuration: 2592000000,

    // Role IDs allowed to host giveaways.
    allowedRoles: [],

    // Role IDs that bypass giveaway restrictions.
    bypassRoles: [],
  },

  // =========================
  // BIRTHDAY SETTINGS
  // =========================
  birthday: {
    // Role ID given to users on their birthday.
    defaultRole: null,

    // Channel ID where birthday announcements are posted.
    announcementChannel: null,

    // Timezone used to calculate birthday dates.
    timezone: "UTC",
  },

  // =========================
  // VERIFICATION SETTINGS
  // =========================
  verification: {
    // Message shown when posting the verification panel.
    defaultMessage: "Click the button below to verify yourself and gain access to the server!",

    // Text on the verification button.
    defaultButtonText: "Verify",

    // Automatic verification behavior.
    autoVerify: {
      // How automatic verification decides who is auto-approved:
      // - "none"        = everyone is auto-verified immediately
      // - "account_age" = account must be older than set days
      // - "server_size" = auto-verify everyone only in smaller servers
      defaultCriteria: "none",

      // Days used when `defaultCriteria` is `account_age`.
      defaultAccountAgeDays: 7,

      // Member count threshold used when `defaultCriteria` is `server_size`.
      // Example: 1000 means auto-verify if server has fewer than 1000 members.
      serverSizeThreshold: 1000,

      // Allowed safety limits for account-age requirements.
      // 1 = minimum day, 365 = maximum days.
      minAccountAge: 1,
      maxAccountAge: 365,

      // If true, user receives a DM after verification.
      sendDMNotification: true,

      // Human-readable descriptions for each criteria mode.
      criteria: {
        account_age: "Account must be older than specified days",
        server_size: "All users if server has less than 1000 members",
        none: "All users immediately"
      }
    },

    // Minimum time between verification attempts (milliseconds).
    // 5000 = 5 seconds.
    verificationCooldown: 5000,

    // Maximum failed attempts allowed inside the time window below.
    maxVerificationAttempts: 3,

    // Time window for counting attempts (milliseconds).
    // 60000 = 1 minute.
    attemptWindow: 60000,

    // In-memory safety limits (helps avoid unbounded memory growth).
    maxCooldownEntries: 10000,
    maxAttemptEntries: 10000,
    // Cleanup frequency for cooldown/attempt maps (milliseconds).
    // 300000 = 5 minutes.
    cooldownCleanupInterval: 300000,
    // Maximum metadata payload size for audit entries (bytes).
    maxAuditMetadataBytes: 4096,
    // Maximum number of audit entries kept in memory.
    maxInMemoryAuditEntries: 1000,
    // If true, log every verification action.
    logAllVerifications: true,
    // If true, preserve verification audit history.
    keepAuditTrail: true,
  },

  // =========================
  // WELCOME / GOODBYE MESSAGES
  // =========================
  welcome: {
    // Welcome template posted when a user joins.
    // Placeholders: {user}, {server}, {memberCount}
    defaultWelcomeMessage:
      "Welcome {user} to {server}! We now have {memberCount} members!",
    // Goodbye template posted when a user leaves.
    // Placeholders: {user}, {memberCount}
    defaultGoodbyeMessage:
      "{user} has left the server. We now have {memberCount} members.",
    // Channel ID for welcome messages.
    defaultWelcomeChannel: null,
    // Channel ID for goodbye messages.
    defaultGoodbyeChannel: null,
  },

  // =========================
  // COUNTER CHANNELS
  // =========================
  counters: {
    defaults: {
      // Default naming/description templates for counter entries.
      name: "{name} Counter",
      description: "Server {name} counter",
      // Channel type used for counters (typically "voice").
      type: "voice",
      // Channel name format. `{count}` is replaced automatically.
      channelName: "{name}-{count}",
    },
    permissions: {
      // Default denied permissions for the counter channel.
      deny: ["VIEW_CHANNEL"],
      // Default allowed permissions for the counter channel.
      allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"],
    },
    messages: {
      // Default response messages for counter actions.
      created: "✅ Created counter **{name}**",
      deleted: "🗑️ Deleted counter **{name}**",
      updated: "🔄 Updated counter **{name}**",
    },
    types: {
      // Built-in counter types and how each count is calculated.
      members: {
        name: "👥 Members",
        description: "Total members in the server",
        getCount: (guild) => guild.memberCount.toString(),
      },
      bots: {
        name: "🤖 Bots",
        description: "Total bot accounts in the server",
        getCount: (guild) =>
          guild.members.cache.filter((m) => m.user.bot).size.toString(),
      },
      members_only: {
        name: "👤 Humans",
        description: "Total human members (non-bots)",
        getCount: (guild) =>
          guild.members.cache.filter((m) => !m.user.bot).size.toString(),
      },
    },
  },

  // =========================
  // GENERIC BOT MESSAGES
  // =========================
  messages: {
    noPermission: "You do not have permission to use this command.",
    cooldownActive: "Please wait {time} before using this command again.",
    errorOccurred: "An error occurred while executing this command.",
    missingPermissions:
      "I am missing required permissions to perform this action.",
    commandDisabled: "This command has been disabled.",
    maintenanceMode: "The bot is currently in maintenance mode.",
  },

  // =========================
  // FEATURE TOGGLES
  // =========================
  // Set any feature to `false` to disable it globally.
  features: {
    // Core systems.
    economy: true,
    leveling: true,
    moderation: true,
    logging: true,
    welcome: true,

    // Community engagement systems.
    tickets: true,
    giveaways: true,
    birthday: true,
    counter: true,

    // Security and self-service systems.
    verification: true,
    reactionRoles: true,
    joinToCreate: true,

    // Utility/quality-of-life modules.
    voice: true,
    search: true,
    tools: true,
    utility: true,
    community: true,
    fun: true,
  },
};

export function validateConfig(config) {
  const errors = [];

  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Environment variables check:');
    logger.debug('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
    logger.debug('TOKEN exists:', !!process.env.TOKEN);
    logger.debug('CLIENT_ID exists:', !!process.env.CLIENT_ID);
    logger.debug('GUILD_ID exists:', !!process.env.GUILD_ID);
    logger.debug('POSTGRES_HOST exists:', !!process.env.POSTGRES_HOST);
    logger.debug('NODE_ENV:', process.env.NODE_ENV);
  }

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN environment variable)");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID environment variable)");
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.POSTGRES_HOST) {
      errors.push("PostgreSQL host is required in production (POSTGRES_HOST environment variable)");
    }
    if (!process.env.POSTGRES_USER) {
      errors.push("PostgreSQL user is required in production (POSTGRES_USER environment variable)");
    }
    if (!process.env.POSTGRES_PASSWORD) {
      errors.push("PostgreSQL password is required in production (POSTGRES_PASSWORD environment variable)");
    }
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Bot configuration errors:", configErrors.join("\n"));
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

export const BotConfig = botConfig;

export function getColor(path, fallback = "#99AAB5") {
  
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );
  
  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

export function getRandomColor() {
  const colors = Object.values(botConfig.embeds.colors).flatMap((color) =>
    typeof color === "string" ? color : Object.values(color),
  );
  return colors[Math.floor(Math.random() * colors.length)];
}

export default botConfig;

import discord
from discord.ext import commands
from discord.ui import View, Button
from discord import app_commands
import datetime
import asyncio
import json
import os

# --- ⚙️ CONFIGURACIÓN ---
TOKEN = 'MTQ5MjAxMTIzMTIyNDEzOTg5Ng.GsXKKr.70ROcSnenabNXmEzIrVqHiqY2JPsqjMoykDcRo'
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

# Cooldown
DIAS_COOLDOWN = 7
ARCHIVO_COOLDOWN = "cooldowns.json"

def consultar_cooldown(usuario_id):
    if not os.path.exists(ARCHIVO_COOLDOWN):
        return False, None
    with open(ARCHIVO_COOLDOWN, 'r') as f:
        try:
            data = json.load(f)
        except:
            return False, None
    fecha_test_str = data.get(str(usuario_id))
    if not fecha_test_str:
        return False, None
    fecha_test = datetime.datetime.fromisoformat(fecha_test_str)
    fecha_fin = fecha_test + datetime.timedelta(days=DIAS_COOLDOWN)
    ahora = datetime.datetime.now()
    if ahora < fecha_fin:
        return True, (fecha_fin - ahora)
    return False, None

# ==========================================
# QUEUE CLASS
# ==========================================
class StellarQueue(View):
    def __init__(self, tester_mencion):
        super().__init__(timeout=None)
        self.participantes = []
        self.testers_activos = [tester_mencion]
        self.update_task = None  # Tarea de actualización automática

    async def start_auto_update(self):
        """Inicia la tarea que actualiza el embed cada 30 segundos"""
        if self.update_task is None or self.update_task.done():
            self.update_task = asyncio.create_task(self.auto_update_loop())

    async def auto_update_loop(self):
        """Bucle que actualiza el mensaje cada 30 segundos"""
        while True:
            await asyncio.sleep(30)
            if not mensaje_lista_viva:
                break
            try:
                await self.actualizar_embed()
            except:
                break

    async def actualizar_embed(self, interaction: discord.Interaction = None):
        """Actualiza el embed de la cola"""
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
        en_cooldown, t = consultar_cooldown(interaction.user.id)
        if en_cooldown:
            return await interaction.response.send_message("❌ Tienes cooldown activo. Usa /tiempo", ephemeral=True)
        
        if interaction.user in self.participantes:
            return await interaction.response.send_message("Ya estás en la cola.", ephemeral=True)
        
        if len(self.participantes) < 20:
            self.participantes.append(interaction.user)
            if len(self.participantes) == 1:
                try:
                    await interaction.user.send("Atención! Ahora estás en el **Top 1**.")
                except:
                    pass
            await self.actualizar_embed(interaction)
        else:
            await interaction.response.send_message("La cola está llena.", ephemeral=True)

# ==========================================
# COMANDOS
# ==========================================
@bot.hybrid_command(name="sync", description="Sincroniza comandos slash")
async def sync(ctx: commands.Context):
    if ctx.author.id != TU_ID_DE_USUARIO:
        return await ctx.send("❌ Solo el dueño puede usar esto.", ephemeral=True)
    
    await ctx.send("🔄 Sincronizando comandos...")
    try:
        synced = await bot.tree.sync(guild=discord.Object(id=TEST_GUILD_ID))
        await ctx.send(f"✅ {len(synced) if synced else 0} comandos sincronizados.")
    except Exception as e:
        await ctx.send(f"❌ Error: {e}")

@bot.tree.command(name="abrir", description="Abre la cola de tests (Stellar Tierlist)")
async def slash_abrir(interaction: discord.Interaction):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
    
    global mensaje_lista_viva, mensaje_aviso_cerrado, view_actual
    
    # Limpiar mensajes anteriores
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
    
    mensaje_lista_viva = await interaction.followup.send("@here", embed=embed, view=view_actual)
    
    await view_actual.start_auto_update()

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
                await view_actual.participantes[0].send("Atención! Ahora estás en el **Top 1**.")
            except:
                pass
                
        await view_actual.actualizar_embed()
        await interaction.followup.send(f"✅ Canal creado: {ticket_canal.mention}")
        
    except Exception as e:
        await interaction.followup.send(f"❌ Error: {e}")

@bot.tree.command(name="subir", description="Sube el resultado del test")
@app_commands.describe(region="Región", modalidad="Modalidad", rol_viejo="Rol anterior", rol_nuevo="Rol nuevo", miembro="Miembro", nombre_mc="Nombre MC")
async def slash_subir(interaction: discord.Interaction, region: str, modalidad: str, rol_viejo: discord.Role, rol_nuevo: discord.Role, miembro: discord.Member, nombre_mc: str):
    await interaction.response.defer()
    if not es_staff(interaction.user):
        return await interaction.followup.send("❌ No tienes permiso.", ephemeral=True)
    
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

@bot.tree.command(name="setstaffrole", description="Añade un rol como Staff (acceso total a comandos)")
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
    await interaction.followup.send(
        f"✅ El rol **{role.name}** ha sido añadido como **Staff**.\n"
        f"Ahora todos los miembros con este rol tienen acceso a los comandos del bot.",
        ephemeral=True
    )

@bot.tree.command(name="staffmembers", description="Muestra los roles de staff")
async def slash_staffmembers(interaction: discord.Interaction):
    await interaction.response.defer()
    if not staff_roles:
        return await interaction.followup.send("Aún no hay roles de staff configurados.")
    
    txt = "\n".join(f"• <@&{rid}>" for rid in staff_roles)
    embed = discord.Embed(title="Roles de Staff", description=txt, color=discord.Color.gold())
    await interaction.followup.send(embed=embed)

@bot.tree.command(name="tiempo", description="Ver cooldown")
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

bot.run(TOKEN)
