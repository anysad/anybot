import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import player from '../../typings/player';
import parseMS from "../../functions/parseMS";
import buildTimeCode from "../../functions/buildTimeCode";

export default {
    category: 'Music',
    description: 'Set the playing time of current song to another position.',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        { name: 'position', description: 'To what time position the song should seek (in seconds).', type: ApplicationCommandOptionType.Number, required: true, minValue: 0}
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
            var seekNumber = options.interaction?.options.get('position')?.value
            // @ts-ignore
            if(seekNumber > queue.songs[0].duration) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setDescription('❌ The position you specified is greater than the duration of the song.')
                ],
                ephemeral: true
            })

            // @ts-ignore
            await queue.seek(seekNumber)

            return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Green')
                    .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                    .setTimestamp()
                    // @ts-ignore
                    .setTitle(`🔁 Seeked the song to ` + buildTimeCode(parseMS(seekNumber*1000)) + `.`)
                ]
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
} as CommandObject