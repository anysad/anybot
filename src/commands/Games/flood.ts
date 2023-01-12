import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { Flood } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of flood in your channel.',
    guildOnly: true,
    options: [
        { name: 'difficulty', description: 'choose the difficulty', type: ApplicationCommandOptionType.Integer, choices: [
            { name: 'easy', value: 8 }, { name: 'medium', value: 13 }, { name: 'hard', value: 18 }],
        },
    ],
    callback: async (options: CommandUsage) => {
        try {
            new Flood({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                difficulty: options.interaction?.options.get('difficulty')?.value,
                embed: {
                    title: 'Flood',
                    color: randomHexColor()
                },
                buttonStyle: 'PRIMARY',
                emojis: [ '🟥', '🟦', '🟨', '🟩', '🟪' ],
                winMessage: 'You won! You took **{turns}** turns.',
                loseMessage: 'You lost! You took **{turns}** turns.',
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