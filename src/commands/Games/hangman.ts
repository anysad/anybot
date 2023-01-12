import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
const hangman = require('discord-hangman')

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of hangman.',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            await hangman.create(options.interaction, 'random')
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