import client from "./typings/client";
import WOK, { DefaultCommands } from "wokcommands";
import 'dotenv/config'
import path from 'path';

client.on('ready', () => {
    new WOK({
        client: client,
        commandsDir: path.join(__dirname, './commands'),
        botOwners: ['349162342669352970'],
        disabledDefaultCommands: [
            DefaultCommands.ChannelCommand,
            DefaultCommands.CustomCommand,
            DefaultCommands.Prefix,
            DefaultCommands.RequiredPermissions,
            DefaultCommands.RequiredRoles,
            DefaultCommands.ToggleCommand
        ],
        mongoUri: process.env['MONGOOSE_CONNECTION_STRING'],
        testServers: ['1019702847916494928']
    })
    console.log('Bot should be online!')
})

client.login(process.env['DISCORD_API'])