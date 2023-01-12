import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    description: 'Skip the current playing to the next song in the queue.',
    type: CommandType.SLASH,
    guildOnly: true,

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
                    .setTitle(`❌ | I am already playing music in <#${options.guild?.members.me?.voice.channelId}>`)
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
            if(queue?.autoplay && queue.songs.length <= 1) {
                await queue.stop().then(() => {
                    return options.interaction?.reply({
                        embeds: [new EmbedBuilder()
                            .setColor('Red')
                            .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            .setTimestamp()
                            .setTitle('⏹ Stopped the music since there was no songs in the queue.')
                        ]
                    })
                })
            } else {
                await player.skip(queue).then(() => {
                    return options.interaction?.reply({
                        embeds: [new EmbedBuilder()
                            .setColor('Green')
                            .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            .setTimestamp()
                            .setTitle('⏭ Song has been skipped.')
                        ]
                    })
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