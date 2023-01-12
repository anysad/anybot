import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import player from '../../typings/player';
import createProgressBar from '../../functions/createProgressBar';
import getPlayerTimeStamp from '../../functions/getplayertimestamp';

export default {
    category: 'Music',
    description: 'Get the current playing song of the queue.',
    type: CommandType.SLASH,
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
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

            const progress = createProgressBar(queue);
            const perc = getPlayerTimeStamp(queue);

            const embed = new EmbedBuilder().setColor('Random')
                .setTitle('Now Playing')
                .setDescription(`🎶 | **${queue.songs[0].name}**! (\`${perc.progress}%\`)\n${queue.songs[0].user?.tag}`)
                .addFields([
                    {
                        name: '\u200b', value: progress.replace(/ 0:00/g, ' ◉ LIVE')
                    }
                ])
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })

            return options.interaction?.reply({ embeds: [embed] });

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