import { CommandObject, CommandType, CommandUsage } from 'wokcommands';
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    type: CommandType.SLASH,
    description: 'Play your favourite song in your voice channel.',
    guildOnly: true,
    options: [
        { name: 'name-or-link', description: 'The song you want to play.', required: true, type: ApplicationCommandOptionType.String }
    ],

    callback: async (options: CommandUsage) => {
        try {
            const song = options.interaction?.options.get('name-or-link')?.value;
            if (!options.member?.voice.channel) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setTitle('❌ | Please join a voice channel.')
                ],
                ephemeral: true
            })
    
            if(options.member?.voice.channel.userLimit != 0 && options.member?.voice.channel.full) return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Red')
                    .setTimestamp()
                    .setTitle('❌ | Your channel is full.')
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
    
            let msg = await options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setColor('Green')
                    .setTimestamp()
                    .setTitle(`🔎 Searching...`)
                    .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                ]
            }).catch(e => {
                console.log(e)
            })
    
            // @ts-ignore
            const queue = await player.getQueue(options.guild)
            
            // @ts-ignore
            await player.play(options.member?.voice.channel, song, {
                textChannel: options.interaction?.channel,
                member: options.member
            }).then(async () => {
                await options.interaction?.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor('Green')
                        .setTimestamp()
                        // @ts-ignore
                        .setTitle(`${queue?.songs.length > 0 ? `📑 | Added to the queue...` : `🎶 | Playing...`}`,)
                        .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
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