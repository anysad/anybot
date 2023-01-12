import { CommandObject, CommandType, CommandUsage } from 'wokcommands';
import { Colors, Embed, EmbedBuilder } from 'discord.js'
import player from '../../typings/player';

export default {
    category: 'Music',
    type: CommandType.SLASH,
    description: 'Get song list of the queue.',
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
                    .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                ],
                ephemeral: true
            })

            const tracks = queue.songs.slice(0, 10).map((m, i) => {
                return `${i + 1}. [**${m.name}**](${m.url}) - ${
                    m.user?.tag
                }`;
            });
            const currentTrack = queue.songs[0];

            return options.interaction?.reply({
                embeds: [
                    {
                        title: "Song Queue",
                        description: `${tracks.join("\n")}${
                            queue.songs.length > tracks.length
                                ? `\n...${
                                      queue.songs.length - tracks.length === 1
                                          ? `${
                                                queue.songs.length - tracks.length
                                            } more track`
                                          : `${
                                                queue.songs.length - tracks.length
                                            } more tracks`
                                  }`
                                : ""
                        }`,
                        // @ts-ignore
                        color: getRandomColor(),
                        fields: [
                            {
                                name: "Now Playing",
                                value: `🎶 | [**${currentTrack.name}**](${currentTrack.url}) - ${currentTrack.user?.tag}`,
                            },
                        ],
                        footer: {
                            text: `Requested by ${options.member?.user.tag}`,
                            icon_url: options.interaction?.user.displayAvatarURL()
                        }
                    },
                ],
            });
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

function getRandomColor() {
    return Math.floor(1000000 + Math.random() * 900000);
}