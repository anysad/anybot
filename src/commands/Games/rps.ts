import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { RockPaperScissors } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'If you have a serious argument, choose who won.',
    guildOnly: true,
    options: [
        { name: 'user', description: 'The user you want to play against.', required: true, type: ApplicationCommandOptionType.User }
    ],

    callback: async (options: CommandUsage) => {
        try {
            new RockPaperScissors({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                opponent: options.interaction?.options.getUser('user'),
                embed: {
                  title: 'Rock Paper Scissors',
                  description: 'Press a button below to make a choice.',
                  color: randomHexColor(),
                },
                emojis: {
                  rock: '🌑',
                  paper: '📰',
                  scissors: '✂️',
                },
                buttons: {
                    rock: 'Rock',
                    paper: 'Paper',
                    scissors: 'Scissors'
                },
                mentionUser: true,
                winMessage: '**{player}** won the game.',
                tieMessage: 'Game ended with a tie! Somehow no one lost the game.',
                timeoutMessage: 'Game timeouted! Were too busy doing other things...',
                playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
                buttonStyle: 'PRIMARY',
                pickMessage: 'You choose {emoji}.',
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