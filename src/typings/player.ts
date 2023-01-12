import { DisTube } from 'distube';
import client from './client';
import { EmbedBuilder } from 'discord.js'

const distube = new DisTube(client, {
    leaveOnFinish: false,
    leaveOnStop: false,
    leaveOnEmpty: true,
    emptyCooldown: 60,
    savePreviousSongs: true
})

distube
    .on('playSong', (queue, song) => {
        queue.textChannel?.send({
            embeds: [new EmbedBuilder()
                // @ts-ignore
                .setTitle(`🎶 | Now Playing: ` + song.name)
                .setURL(song.url)
                .setColor('Green')
                .setThumbnail(`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`)
                .addFields(
                    // @ts-ignore
                    { name: 'Views', value: `${song.views}`, inline: true },
                    { name: 'Likes', value: `${song.likes}`, inline: true },
                    { name: 'Requested By', value: `<@${song.user?.id}>`, inline: true },
                    { name: 'Duration', value: `${song.formattedDuration}`, inline: true },
                    { name: 'Queue', value: `${queue.songs.length} song(s) - ${queue.formattedDuration}`, inline: true },
                    { name: 'Volume', value: `${queue.volume}`, inline: true }
                )
            ]
        })
    })
    .on('error', (channel, error) => {
        console.log(error)
    })

// distube.on('playSong', (queue, song) => {
//     queue.textChannel?.send({
//         embeds: [new EmbedBuilder()
//             .setColor('Green')
//             .addFields(
//                 // @ts-ignore
//                 { name: 'Views', value: song.views, inline: true },
//                 { name: 'Likes', value: song.likes, inline: true },
//                 { name: 'Requested By', value: song.user?.tag, inline: true },
//                 { name: 'Duration', value: song.formattedDuration, inline: true },
//                 { name: 'Queue', value: `${queue.songs.length+1} song(s) - ${queue.formattedDuration}`, inline: true },
//                 { name: 'Volume', value: queue.volume, inline: true }
//             )
//             .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
//         ]
//     })
// })

// distube.on('searchResult', (msg, res, query) => {
//     console.log(res)
// })

// distube.on('error', (ch, err) => {
//     return ch?.send({
//         embeds: [new EmbedBuilder()
//             .setTitle(`⛔ | Error`)
//             .setColor('Red')
//             .setDescription(`${err}`)
//         ],
//     })
// })

export default distube;