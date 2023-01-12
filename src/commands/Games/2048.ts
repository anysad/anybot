import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { TwoZeroFourEight } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a once popular game 2048 in your discord channel.',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            new TwoZeroFourEight({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: '2048',
                  color: randomHexColor(),
                },
                emojis: {
                    up: '⬆️',
                    down: '⬇️',
                    left: '⬅️',
                    right: '➡️',
                },
                buttonStyle: 'PRIMARY',
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