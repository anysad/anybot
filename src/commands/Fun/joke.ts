import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder } from 'discord.js'
import axios from 'axios'
import 'dotenv/config'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'If are having a bad day, make it better with a joke.',
    guildOnly: true,

    callback: async (options: CommandUsage) => {
        try {
            var joke = await axios.get('https://api.api-ninjas.com/v1/jokes', {
                // @ts-ignore
                headers: { 'X-Api-Key': process.env['FUN_API_KEY'] }
            })
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('**' + joke.data[0].joke + '**')
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