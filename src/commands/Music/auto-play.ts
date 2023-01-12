import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    description: 'Toggle the autoplay mode of the queue.',
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
            if(queue.autoplay) {
                // @ts-ignore
                await player.toggleAutoplay(options.interaction)
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle(`🔄 | Autoplay has been deactivated.`)
                    ]
                })
            } else {
                // @ts-ignore
                await player.toggleAutoplay(options.interaction)
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle(`🔄 | Autoplay has been activated.`)
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