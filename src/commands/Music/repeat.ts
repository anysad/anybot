import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    description: 'Repeat the current song/queue.',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        { name: 'mode', description: 'later', type: ApplicationCommandOptionType.Number, required: true, choices: [
            { name: 'Song', value: 1 }, { name: 'Queue', value: 2 }, { name: 'Off', value: 0 }
        ] }
    ],

    callback: async (options: CommandUsage) => {
        try {
            if (!options.member?.voice.channel) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setTitle('❌ | Please join a voice channel.')
                ],
                ephemeral: true
            })

            if(options.member?.voice.channelId && options.guild?.members.me?.voice.channelId !== options.guild?.members.me?.voice.channelId) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setTitle(`❌ I am already playing music in <#${options.guild?.members.me?.voice.id}>`)
                ],
                ephemeral: true
            })

            // @ts-ignore
            const queue = await player.getQueue(options.guild)
            if(!queue || !queue.songs.length) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setDescription('❌ | There are no songs in the queue.')
                ],
                ephemeral: true
            })

            // @ts-ignore
            const repeatModeNumber = options.interaction?.options.get('mode')?.value
            // @ts-ignore
            const repeatMode = repeatModeNumber === 1 ? "Song" : repeatModeNumber === 2 ? "Queue" : "Off"
            // @ts-ignore
            if(queue.repeatMode === repeatModeNumber) {
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle(`🔁 Repeat mode is already set to ${repeatMode}.`)
                    ]
                })
            } else {
                // @ts-ignore
                await player.setRepeatMode(queue, repeatModeNumber)
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle(`🔁 Repeat mode has been set to ${repeatMode}.`)
                    ]
                })
            }

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