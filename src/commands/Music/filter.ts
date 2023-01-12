import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import player from '../../typings/player';
import toTitleCase from '../../functions/toTitleCase'

export default {
    category: 'Music',
    description: 'Add filters to the current playing song to make it unique.',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: 'add', 'description': 'The filter you want to add.', type: ApplicationCommandOptionType.Subcommand, options: [
                {
                    name: 'filter', description: 'The filter you want to add.', type: ApplicationCommandOptionType.String, required: true, choices: [
                        { name: '3D', value: '3d' }, { name: 'Bassboost', value: 'bassboost' }, { name: 'Echo', value: 'echo' }, { name: 'Nightcore', value: 'nightcore' },
                        { name: 'Vaporwave', value: 'vaporwave' }, { name: 'Karaoke', value: 'karaoke' }, { name: 'Flanger', value: 'flanger' },
                        { name: 'Reverse', value: 'reverse' }, { name: 'Tremolo', value: 'tremolo' }, { name: 'Surround', value: 'surround' }, { name: 'Phaser', value: 'phaser' },
                        { name: 'Gate', value: 'gate' },
                    ]
                },
            ]
        },
        {
            name: 'remove', 'description': 'The filter you want to add.', type: ApplicationCommandOptionType.Subcommand, options: [
                {
                    name: 'filter', description: 'The filter you want to add.', type: ApplicationCommandOptionType.String, required: true, choices: [
                        { name: '3D', value: '3d' }, { name: 'Bassboost', value: 'bassboost' }, { name: 'Echo', value: 'echo' }, { name: 'Nightcore', value: 'nightcore' },
                        { name: 'Vaporwave', value: 'vaporwave' }, { name: 'Karaoke', value: 'karaoke' }, { name: 'Flanger', value: 'flanger' },
                        { name: 'Reverse', value: 'reverse' }, { name: 'Tremolo', value: 'tremolo' }, { name: 'Surround', value: 'surround' }, { name: 'Phaser', value: 'phaser' },
                        { name: 'Gate', value: 'gate' },
                    ]
                },
            ]
        },
        {
            name: 'clear', description: 'Clear all of the current filters.', type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'list', description: 'Get the list of the active filters on the queue. ', type: ApplicationCommandOptionType.Subcommand
        }
    ],

    callback: async (options: CommandUsage) => {
        try {
            if (options.interaction?.isChatInputCommand()) {

                if (!options.member?.voice.channel) return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Red')
                        .setTimestamp()
                        .setTitle('❌ | Please join a voice channel.')
                    ],
                    ephemeral: true
                })

                if (options.member?.voice.channelId && options.guild?.members.me?.voice.channelId !== options.guild?.members.me?.voice.channelId) return options.interaction?.reply({
                    embeds: [new EmbedBuilder()
                        .setColor('Red')
                        .setTimestamp()
                        .setTitle(`❌ | I am already playing music in <#${options.guild?.members.me?.voice.channelId}>`)
                    ],
                    ephemeral: true
                })

                // @ts-ignore
                const queue = await player.getQueue(options.guild)
                const args = options.interaction?.options.getSubcommand()
                const filter = options.interaction.options.getString('filter')
                if (args === "add") {
                    // @ts-ignore
                    if (!queue?.filters.names.includes(filter)) {
                        // @ts-ignore
                        queue?.filters.add(filter)
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Green')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | ${toTitleCase(filter)} has been added to the queue filters.`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    } else {
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Red')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | ${toTitleCase(filter)} was already added.`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    }
                } else if (args === "remove") {
                    // @ts-ignore
                    if (queue?.filters.names.includes(filter)) {
                        // @ts-ignore
                        queue?.filters.remove(filter)
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Green')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | ${toTitleCase(filter)} has been removed from the queue.`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    } else {
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Red')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | ${toTitleCase(filter)} wasn't added to the queue filters.`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    }
                } else if (args === "clear") {
                    queue?.filters.clear()
                    await options.interaction?.reply({
                        embeds: [new EmbedBuilder()
                            .setColor('Green')
                            .setTimestamp()
                            // @ts-ignore
                            .setTitle(`🎶 | Queue filters were cleared.`)
                            .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                        ]
                    })
                } else if (args === "list") {
                    let filterList = toTitleCase(queue?.filters.names.toString().replace(',', ', '))
                    if(queue?.filters.names.length === 0) {
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Red')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | There aren't any of filters yet.`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    } else {
                        await options.interaction?.reply({
                            embeds: [new EmbedBuilder()
                                .setColor('Green')
                                .setTimestamp()
                                // @ts-ignore
                                .setTitle(`🎶 | Current queue filters are: ${filterList}`)
                                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                            ]
                        })
                    }
                }
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