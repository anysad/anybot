import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import axios from 'axios'
import 'dotenv/config'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Spice up your knowledge with some facts.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            var fact = await axios.get('https://api.api-ninjas.com/v1/facts', {
                // @ts-ignore
                headers: { 'X-Api-Key': process.env['FUN_API_KEY'] }
            })
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('**' + fact.data[0].fact + '**')
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