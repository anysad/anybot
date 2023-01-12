import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
const TicTacToe = require('discord-tictactoe');

const game = new TicTacToe({
    commandOptionName: 'user'
});

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of TicTacToe with your friends/AI.',
    guildOnly: true,
    options: [
        { name: 'user', description: 'The user you want to play against.', required: false, type: ApplicationCommandOptionType.User }
    ],

    callback: async (options: CommandUsage) => {
        try {
            game.handleInteraction(options.interaction);
        } catch (e) {
            console.log(e)
            return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⛔ | Error`)
                    .setColor('Red')
                    .setDescription(`${e}`)
                ],
                ephemeral: true
            })
        }
    }

} as CommandObject