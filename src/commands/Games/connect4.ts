import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
const { Connect4 } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of Connect4 with your friend.',
    guildOnly: true,
    options: [
        { name: 'user', description: 'The user you want to play against.', required: true, type: ApplicationCommandOptionType.User }
    ],

    callback: async (options: CommandUsage) => {
        try {
            new Connect4({
                message: options.interaction,
                isSlashGame: true,
                opponent: options.interaction?.options.getUser('user'),
                embed: {
                    title: 'Connect4',
                    statusTitle: 'Status',
                    color: 'Red'
                },
                emojis: {
                    board: '⚪',
                    player1: '🔴',
                    player2: '🟡',
                },
                mentionUser: true,
                timeoutTime: 300000,
                buttonStyle: 'PRIMARY',
                turnMessage: '{emoji} | **{player}**\'s turn',
                winMessage: '{emoji} | **{player}** won the game.',
                tieMessage: 'Game ended with a tie! Somehow no one lost the game.',
                timeoutMessage: 'Game timeouted! Were too busy doing other things...',
                playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
            }).startGame()
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