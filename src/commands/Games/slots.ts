import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { Slots } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of slots in your channel.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            new Slots({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                    title: 'Slot Machine',
                    color: randomHexColor()
                },
                slots: ['🍇', '🍊', '🍋', '🍌']
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