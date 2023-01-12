import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import axios from 'axios'
import 'dotenv/config'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Get a quote based on your choice.',
    guildOnly: true,
    options: [
        { name: 'category', description: 'The category of the quote.', type: ApplicationCommandOptionType.String, required: true, choices: [
            { name: 'Business', value: 'business' }, { name: 'Communications', value: 'communications' }, { name: 'Experience', value: 'experience' },
            { name: 'Failure', value: 'failure' }, { name: 'Family', value: 'family' }, { name: 'Happiness', value: 'happiness' }, { name: 'Knowledge', value: 'knowledge' },
            { name: 'Life', value: 'life' }, { name: 'Love', value: 'love' }, { name: 'Success', value: 'success' }, { name: 'Money', value: 'money' }, { name: 'Dating', value: 'dating' },
        ] }
    ],

    callback: async (options: CommandUsage) => {
        try {
            var quote = await axios.get('https://api.api-ninjas.com/v1/quotes?category=' + options.interaction?.options.get('category')?.value, {
                // @ts-ignore
                headers: { 'X-Api-Key': process.env['FUN_API_KEY'] }
            })
            
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('**"' + quote.data[0].quote + '"** — ' + quote.data[0].author)
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