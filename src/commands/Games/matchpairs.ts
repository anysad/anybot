import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import randomHexColor from '../../functions/randomHexColor';
const { MatchPairs } = require('discord-gamecord');

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Find emojis that are similiar to each other.',
    guildOnly: true,
    callback: async (options: CommandUsage) => {
        try {
            new MatchPairs({
                message: options.interaction,
                isSlashGame: true,
                timeoutTime: 300000,
                embed: {
                    title: 'Match the Couples',
                    color: randomHexColor(),
                    description: '**Click on the buttons to match emojis with their pairs.**'
                },
                emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
                winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
                loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
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