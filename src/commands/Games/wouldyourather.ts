import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { WouldYouRather } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Decide, what would you choose between two options?',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            new WouldYouRather({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Would you rather',
                  color: randomHexColor(),
                },
                buttons: {
                    option1: 'Option 1',
                    option2: 'Option 2',
                },
                errMessage: 'Unable to fetch question data! Please try again.',
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