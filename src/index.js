import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands
const commandsPath = join(__dirname, 'commands');
for (const file of readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(join(commandsPath, file)).href);
  const cmd = mod.default ?? mod;
  if (cmd?.data && cmd?.execute) {
    client.commands.set(cmd.data.name, cmd);
  } else {
    console.warn(`[warn] command ${file} missing data/execute export`);
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`:> logged in as ${c.user.tag} — ${client.commands.size} commands ready`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error(err);
    const reply = { content: 'something exploded :o', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in env. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
