import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import { TriviaManager } from 'discord-trivia'

export default {
    category: 'Games',
    type: CommandType.SLASH,
    description: 'Play a game of trivia.',
    guildOnly: true,
    options: [
        { name: 'difficulty', description: 'Difficulty of the questions', required: true, type: ApplicationCommandOptionType.String, choices: [
            { name: 'Easy', value: 'easy' }, { name: 'Medium', value: 'medium' }, { name: 'Hard', value: 'hard' }
        ] },
        { name: 'category', description: 'Category of the questions', required: true, type: ApplicationCommandOptionType.String, choices: [
            { name: 'Music', value: 'ENTERTAINMENT_MUSIC' }, { name: 'Animals', value: 'ANIMALS' }, { name: 'Sports', value: 'SPORTS' }, { name: 'Geography', value: 'GEOGRAPHY' }, { name: 'History', value: 'HISTORY' },
            { name: 'Art', value: 'ART' }, { name: 'Celebrities', value: 'CELEBRITIES' }, { name: 'Video Games', value: 'ENTERTAINMENT_VIDEO_GAMES'}, { name: 'Cartoons/Animations', value: 'ENTERTAINMENT_CARTOON_AND_ANIMATIONS' },
            { name: 'Anime/Manga', value: 'ENTERTAINMENT_JAPANESE_ANIME_AND_MANGA' }, { name: 'Musicals and Theatres', value: 'ENTERTAINMENT_MUSICALS_AND_THEATRES' }, { name: 'Board Games', value: 'ENTERTAINMENT_BOARD_GAMES' },
            { name: 'Television', value: 'ENTERTAINMENT_TELEVISION' }, { name: 'Science and Nature', value: 'SCIENCE_AND_NATURE' }, { name: 'Computer Science', value: 'SCIENCE_COMPUTERS' },
            { name: 'Vehicles', value: 'VEHICLES' }, { name: 'Comics', value: 'ENTERTAINMENT_COMICS' }, { name: 'Books', value: 'ENTERTAINMENT_BOOKS' }, { name: 'Films', value: 'ENTERTAINMENT_FILM' }
        ] },
        { name: 'amount', description: 'Amount of questions', required: true, type: ApplicationCommandOptionType.Number, minValue: 1, maxValue: 15 }
    ],
    callback: async (options: CommandUsage) => {
        try {
            const trivia = new TriviaManager({
                theme: 'Random',
                showAnswers: true,
                image: options.guild?.members.me?.avatarURL()?.toString()
            })
            // @ts-ignore
            trivia.createGame(options.interaction, {
                timePerQuestion: 15000,
                // @ts-ignore
                questionData: {
                    category: options.interaction?.options.get('category')?.value,
                    amount: options.interaction?.options.get('amount')?.value,
                    difficulty: options.interaction?.options.get('difficulty')?.value,
                    type: 'multiple'
                },
                maximumPlayerCount: 2,
                minimumPlayerCount: 1
            }).start()
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