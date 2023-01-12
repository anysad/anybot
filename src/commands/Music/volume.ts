import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    description: 'Set/get volume of the current queue.',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        { name: 'volume', description: 'The volume to set the queue to.', type: ApplicationCommandOptionType.Number, required: false, minValue: 1, maxValue: 100 }
    ],

    callback: async (options: CommandUsage) => {
        try {
            const volume = options.interaction?.options.get('volume')?.value
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
            if(volume) {
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
                await queue.setVolume(volume)

                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        // @ts-ignore
                        .setTitle(`${getVolumeEmoji(volume)} | Volume has been set to **${volume}%**.`)
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                    ]
                })
            } else {
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`${getVolumeEmoji(queue.volume)} | The current queue volume is **${queue.volume}%**.`)
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
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

function getVolumeEmoji(number: number) {
    if (number >= 60) {
        return '🔊'
    } else {
        return '🔉'
    }
}