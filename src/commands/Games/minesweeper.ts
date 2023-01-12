import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { Minesweeper } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Guess a five letter word in a game of Wordle.',
    guildOnly: true,
    options: [
        {
            name: 'amount', description: 'Amount of mines you want to have.', type: ApplicationCommandOptionType.Number, required: true
        }
    ],

    callback: async (options: CommandUsage) => {
        try {
            new Minesweeper ({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Minesweeper',
                  color: randomHexColor(),
                  description: 'Click on the buttons to reveal the blocks except mines.'
                },
                emojis: { flag: '🚩', mine: '💣' },
                mines: options.interaction?.options.get('amount')?.value,
                winMessage: 'You won the game! You successfully avoided all the mines.',
                loseMessage: 'You lost the game! Beaware of the mines next time.',
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