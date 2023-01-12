import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { Snake } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a classic game of snake.',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            new Snake({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Snake',
                  overTitle: 'Game Over',
                  color: randomHexColor(),
                },
                emojis: {
                    board: '⬛',
                    food: '🍎',
                    up: '⬆️', 
                    down: '⬇️',
                    left: '⬅️',
                    right: '➡️',
                },
                snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
                foods: ['🍎', '🍇', '🍊', '🥝', '🥭', '🍐', '🍋'],
                stopButton: 'Stop',
                playerOnlyMessage: 'Only {player} can use these buttons.'
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