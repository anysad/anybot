import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js'
import { getRandomMeme, getLocalRandomMeme } from '@blad3mak3r/reddit-memes';
import disableButtons from '../../functions/disableButtons';

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Watch some memes.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            let meme = await getRandomMeme()

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Next Meme")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("memerate")
                    .setEmoji("↪️")
                    .setDisabled(false),
        
                new ButtonBuilder()
                    .setLabel("Stop")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("memeclose")
                    .setEmoji("🛑")
                    .setDisabled(false)
            )

            const embed = new EmbedBuilder()
                .setTitle(meme.title)
                .setURL("https://www.reddit.com/comments/" + meme.id)
                .setImage(meme.image)
                .setColor('Random')
                .setFooter({ text: `👍 ${meme.ups}` })

            // @ts-ignore
            const intrMsg = await options.interaction?.reply({ embeds: [embed], components: [row] })

            const collector = intrMsg?.createMessageComponentCollector({ time: 180000, componentType: ComponentType.Button })

            // @ts-ignore
            collector?.on("collect", async (i) => {
                if (i.user.id !== options.interaction?.user.id) return i.reply({
                    content: `Only <@${options.interaction?.user.id}> can use these buttons!`,
                    ephemeral: true
                })
        
                if (i.customId === "memerate") {
                    let meme2 = await getRandomMeme()
        
                    const embed2 = new EmbedBuilder()
                        .setTitle(meme2.title)
                        .setURL("https://www.reddit.com/comments/" + meme2.id)
                        .setImage(meme2.image)
                        .setColor('Random')
                        .setFooter({ text: `👍 ${meme2.ups}` })
        
                    await i.update({ embeds: [embed2] })
                }

                //console.log(row)

                if (i.customId === "memeclose") {
                    // @ts-ignore
                    await i.update({ components: [disableButtons(row.components)] })
                }
            })

            // @ts-ignore
            collector?.on('end', async (col, reason) => {
                if(reason === 'time') {
                    // @ts-ignore
                    return options.interaction?.editReply({ components: [disableButtons(row.components)] })
                    //return await intrMsg?.edit({ components: [disableButtons(row.components)] })
                }
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