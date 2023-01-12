import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { Wordle } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Guess a five letter word in a game of Wordle.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            new Wordle({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Wordle',
                  color: randomHexColor(),
                },
                customWord: null,
                winMessage: 'You won! The word was **{word}**.',
                loseMessage: 'You lost! The word was **{word}**.',
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