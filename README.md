# discord-bot :>

Bot de Discord — chaos engine. Construído com [discord.js v14](https://discord.js.org/) e Node 18+.

## Setup

```bash
npm install
cp .env.example .env
# edita .env com DISCORD_TOKEN, CLIENT_ID e (opcional) GUILD_ID
npm run deploy   # registra slash commands
npm start
```

### Como conseguir os tokens

1. Vai em https://discord.com/developers/applications → **New Application**
2. Aba **Bot** → reseta token, copia pra `DISCORD_TOKEN`
3. Aba **General Information** → copia o **Application ID** pra `CLIENT_ID`
4. Pra teste rápido em um servidor só, pega o **Guild ID** (ativa modo dev no Discord, clica com botão direito no server → Copy ID) e bota em `GUILD_ID`. Comandos de guild propagam na hora; globais demoram até 1h.
5. Na aba **OAuth2 → URL Generator**, marca `bot` + `applications.commands`, escolhe permissões (mínimo: `Send Messages`), e usa a URL pra convidar o bot no teu server.

## Comandos

- `/ping` — latência
- `/say texto:<msg>` — bot ecoa a mensagem
- `/chaos` — vibe caótica aleatória

## Estrutura

```
src/
  index.js              # entrypoint, carrega comandos e listeners
  deploy-commands.js    # registra slash commands na API do Discord
  commands/
    ping.js
    say.js
    chaos.js
```

Adicionar comando novo: cria `src/commands/<nome>.js` exportando `{ data, execute }`, roda `npm run deploy`.

## License

MIT
