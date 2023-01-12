import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { FastType } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Decide if you are a fast typer or not.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            new FastType({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Fast Click',
                  color: randomHexColor(),
                  description: 'You have {time} seconds to type the sentence below.'
                },
                colors: {
                  correctButton: 'SUCCESS',
                  wrongButton: 'DANGER',
                },
                sentence: 'Some really cool sentence to fast type.',
                winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
                loseMessage: 'You lost! You didn\'t type the correct sentence in time.',
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