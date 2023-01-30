# XandyBot

This Discord bot does all the shenanigans Rene Alexander S. Castillo does in real life. The funding[^1] for this bot is also sponsored by him... I wish I have generational wealth like he has, it's really hard to be poor and ugly.

## Current Features

- Bot sending a random quote every day at 8:00 AM UTC+8 to the `#general` channel of your server.
- Bot changes its status depending on the time of day. This actually reflects on what the real Xander Castillo does on a daily basis.
- Bot now has its own help command by running `/helphelphelp {command}` where the command input is optional.
- Bot will also give a random answer to a specific statement by running `/lgtm {statement}`, where the statement is required.
- Bot does a callout `HOY @Blitz` every time SJG says something in any channel in a server where **both** the bot and SJG are present. It has a cooldown of an hour before the bot can call him out again.
- Bot can give a random quote upon the request of a user by running `/clown`. This **should not** affect the scheduled sending of random quotes.
- Bot can give a random image of the real Xander Castillo by running `/pogi`.
- Bot can now give a notification if a streamer is currently live on Twitch (limited to only 4 streamers for now).

## Future Features

- Bot can play K-pop songs catered to the real Xander Castillo's liking.

## Prerequisites

### Tools Required To Run Locally

- [Node.js](https://nodejs.org/en/download/) - Currently using version 16.13.0
- [npm](https://nodejs.org/en/download/) - Automatically included when installing Node.js, currently using version 8.1.0
- Your own Discord account - you'll have to create your own bot if you want to run this locally **OR** you can join the [XandyBot](https://discord.gg/vAtFk8n9B2) Discord server to have a development bot assigned to you

## Running the Bot

### Setting Up Your Own Discord Bot and Inviting it to Your Own Server

**NOTE**: This is assuming you have your own Discord account. If not, then please create one :smile:\
**ANOTHER NOTE**: You can skip this part if you are in the XandyBot Discord server. We'll just give you personally the token and the invite link in that case. <a name="TOKEN_NOTE"></a>

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on the "New Application" button.
3. Give your own application a name (e.g. XanderCastillo) and click "Create".
4. Go to the "Bot" tab, and then click "Add Bot". If a prompt appears, just confirm it.
5. The next step is to copy the token of your bot. This token is **confidential** and not really meant to be shared with others (unless needed). You will use the value of this token on the `DISCORD_TOKEN` environment variable. <a name="TOKEN_STEP"></a>
6. Proceed to the "OAuth2" tab and select the "bot" and "applications.commands" option under the "Scopes" section.
7. For the permissions, choose the "Administrator" permission.
   - **NOTE**: Be careful when choosing the "Administrator" permission as this gives full usage of all the Discord development options for the bot. When releasing to production, be wary of what permissions the bot really needs.
8. After selecting the appropriate permissions, click the "Copy" button in the "Scopes" section and invite the bot to your own server.
   - For creating your own Discord server, please refer to this [helpful link](https://discord.com/blog/starting-your-first-discord-server).
   - After creating a server, create a text channel named `xander-bot-test-channel`. Refer again to this [helpful link](https://discord.com/blog/starting-your-first-discord-server#:~:text=To%20make%20a%20new%20channel,and%20choose%20%E2%80%9Ccreate%20channel.%E2%80%9D) if you are having problems creating a text channel.

### Setting the Environment Variables

Please refer to the `.env.example` regarding the needed variables when running the bot in your local environment. Create your own `.env` in the root directory and you can use these recommended values.
| Environment Variable | Description | Recommended Value |
| :--------------------: | ------------------------- | :----------------------:|
| COMMON_SLEEP_TIME | Number of seconds a specific function sleeps after executing a specific function | 60 |
| DISCORD_TOKEN | This is the token of your bot. | Refer to this [specific step](#TOKEN_STEP) or this [note](#TOKEN_NOTE)
| DISCORD_CLIENT_ID | This is the id of your bot. This is needed when refreshing commands. | Refer to this [specific step](#TOKEN_STEP) or this [note](#TOKEN_NOTE)
| XANDER_IMAGE | Any link to an image that is used in the embed for the scheduled sending of the quote | [Copy link address](https://media.discordapp.net/attachments/360409354949754881/891605505766727680/dtPI6VG.png?width=350&height=450)
| XANDER_IMAGE_2 | Any link to an image that is used in the embed for sending a random quote at the user's will | [Copy link address](https://media.discordapp.net/attachments/893759325393289256/901420249101008936/NGVL7394.JPG?width=350&height=450)
| XANDY_LOG_CHANNEL_ID | A specific channel ID on where the bot can send its logs | Find [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-#:~:text=On%20Android%20press%20and%20hold,name%20and%20select%20Copy%20ID.) on how to get a channel ID.
| KRAZY_ID | A Discord user ID where the bot will mention this user when the bot does the callout. In production, this is using SJG's Discord user ID. | Find [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-#:~:text=On%20Android%20press%20and%20hold,name%20and%20select%20Copy%20ID.) on how to get a user ID.
| KRAZY_TIMEOUT | Cooldown, in seconds, on when the bot can do the callout again. In production, this is 3600. | 120
| MESSAGE_ID | This is the message ID of the log sent by the bot. | Find [here](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-#:~:text=On%20Android%20press%20and%20hold,name%20and%20select%20Copy%20ID.) on how to get a message ID.
| ENVIRONMENT | Current environment on where the bot is running | development
| TWITCH_CLIENT_ID | Twitch Client ID needed for the bot to connect to Twitch API | 
| TWITCH_CLIENT_SECRET | Twitch Client Secret needed for the bot to connect to Twitch API |
| TWITCH_LINK | This is actually the link for Amouranth's Twitch - for notifying | https://www.twitch.tv/amouranth

### Setting Up Local Environment and Running the Bot for the First Time

**NOTE**: Once npm is installed in your local machine, please ensure that you can run it via command line and it is fully configured. This is because the steps found in this README will make full use of the command line.

1. Clone this repository in a specific folder.
2. Open the command line and point to the working directory to the specific folder where the project is located (e.g. `cd xandy-bot`)
3. Run `npm install` to install all the needed packages to run this bot.
4. To register the slash commands for your bot, run `npm run refreshcommands`
5. To finally run the bot, run `node .`
6. If you want to run all the scripts from steps 4-5 (just make sure you meet the prerequisite for step 4), run `npm run all-run`
7. To stop it from running, just basically press <kbd>Ctrl</kbd>+<kbd>C</kbd> (or <kbd>⌘</kbd>+<kbd>C</kbd> if on Mac)

### Running the Bot for the Second Time (and onwards)

1. If there are no updates needed, just run using `node .`
2. If the commands are updated or there are new commands developed for the bot, you can opt to run `npm run refreshcommands` first or you can execute the scripts succesfully by running `npm run all-run`
3. To stop it from running, just basically press <kbd>Ctrl</kbd>+<kbd>C</kbd> (or <kbd>⌘</kbd>+<kbd>C</kbd> if on Mac)

[^1]: Everything (bot, source code, server) is really sponsored by Xander's money.
