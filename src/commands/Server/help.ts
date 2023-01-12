import { CommandObject, CommandType, CommandUsage, } from 'wokcommands';
import { EmbedBuilder, ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder, ComponentType } from 'discord.js'
import disableButtons from '../../functions/disableButtons';

export default {
    category: 'Server',
    description: 'Get all of the existing commands in one nice embed.',
    type: CommandType.SLASH,
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            //console.log(options.instance.commandHandler._commands)
            const commands = options.instance.commandHandler._commands
            const cmdArray = Array.from(commands)
            const categories = [...new Set(cmdArray.map((c: any) => c[1]._commandObject.category))]

            const helpArray = categories.map((c: any) => {
                const getCmd = cmdArray
                    .filter((cmd: any) => cmd[1]._commandObject.category == c)
                    .map((cmd: any) => {
                        return {
                            name: cmd[0] || "No Name",
                            description: cmd[1]._commandObject.description || "No Description"
                        }
                    })
                return {
                    name: c,
                    commands: getCmd
                }
            })

            // default page number
            let pageNum = 1


            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: "Help Command" })
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                .setTimestamp()

            const getButtons = (pageNum: any) => {
                return new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Previous")
                        .setCustomId("prev")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(pageNum <= 1),
                    new ButtonBuilder()
                        .setLabel("Next")
                        .setCustomId("next")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(!(pageNum < helpArray.length)),
                );
            };

            embed.setDescription(`**${helpArray[pageNum - 1].name}**`).addFields(
                helpArray[pageNum - 1].commands.map(({ name, description }) => {
                    return {
                        name: `\`${name}\``,
                        value: `${description}`,
                        inline: true,
                    };
                }),
            );

            // @ts-ignore
            const intrMsg = await options.interaction?.reply({ embeds: [embed], components: [getButtons(pageNum)], fetchReply: true });

            const collector = intrMsg?.createMessageComponentCollector({ time: 20000, componentType: ComponentType.Button })

            collector?.on("collect", async (i) => {
                if (i.customId === "next") {
                    pageNum++
                } else if (i.customId === "prev") {
                    pageNum--
                }

                const categ = helpArray[pageNum - 1];

                embed.data.fields = []
                embed.setDescription(`**${categ.name}**`).addFields(
                    categ.commands.map(({ name, description }) => {
                        return {
                            name: `\`${name}\``,
                            value: `${description}`,
                            inline: true,
                        }
                    }),
                ).setFooter({ text: `Page ${pageNum}/${helpArray.length}` })

                // @ts-ignore
                await i.update({ embeds: [embed], components: [getButtons(pageNum)], fetchReply: true })
            });

            collector?.on('end', async (i) => {
                const categ = helpArray[pageNum - 1];

                embed.data.fields = []
                embed.setDescription(`**${categ.name}**`).addFields(
                    categ.commands.map(({ name, description }) => {
                        return {
                            name: `\`${name}\``,
                            value: `${description}`,
                            inline: true,
                        }
                    }),
                ).setFooter({ text: `Page ${pageNum}/${helpArray.length}` })

                // @ts-ignore
                await intrMsg?.edit({ embeds: [embed], components: [disableButtons(getButtons(pageNum).components)], fetchReply: true })
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