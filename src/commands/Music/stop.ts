import { CommandObject, CommandType, CommandUsage } from 'wokcommands';
import { EmbedBuilder } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    type: CommandType.SLASH,
    description: 'Stop the current queue of your voice channel.',
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

            const queue = await player.getQueue(options.member?.voice.channel)

            if(!queue || !queue.songs.length) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setTitle('❌ | There is no songs in the queue.')
                ],
                ephemeral: true
            })

            await queue.stop().then(() => {
                return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle('⏹ | Stopped the music.')
                    ]
                })
            })
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
} as CommandObject;