import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { GuessThePokemon } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Guess the pokemon by its type and abilities.',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            new GuessThePokemon({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                  title: 'Guess The Pokemon',
                  color: randomHexColor(),
                },
                winMessage: 'You guessed it right! It was a {pokemon}.',
                loseMessage: 'Better luck next time! It was a {pokemon}.',
                errMessage: 'Unable to fetch pokemon data! Please try again.',
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