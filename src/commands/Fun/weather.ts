import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import axios from 'axios'
import 'dotenv/config'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Get current weather of a city.',
    guildOnly: true,
    options: [
        { name: 'city', description: 'The city you want to know the weather for.', type: ApplicationCommandOptionType.String, required: true }
    ],

    callback: async (options: CommandUsage) => {
        try {
            var weather = await axios.get('https://api.api-ninjas.com/v1/weather?city=' + options.interaction?.options.get('city')?.value, {
                // @ts-ignore
                headers: { 'X-Api-Key': process.env['FUN_API_KEY'] }
            })
            var weatherdata = weather.data;

            var embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Information for **' + options.interaction?.options.get('city')?.value + '**')
                .addFields(
                    // @ts-ignore
                    { name: 'Temperature', value: weatherdata.temp.toString() + '°C', inline: true },
                    { name: 'Feels Like', value: weatherdata.feels_like.toString() + '°C', inline: true },
                    { name: 'Humidity', value: weatherdata.humidity.toString() + '%', inline: true },
                    { name: 'Wind Speed', value: weatherdata.wind_speed.toString() + 'm/s', inline: true },
                    { name: 'Maximum Temperature', value: weatherdata.max_temp.toString() + '°C', inline: true },
                    { name: 'Minimum Temperature', value: weatherdata.min_temp.toString() + '°C', inline: true },
                )
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
            return options.interaction?.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e)
            if(e == 'AxiosError: Request failed with status code 400') return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⛔ | Error`)
                    .setColor('Red')
                    .setDescription(`The city you entered was not found.`)
                ],
                ephemeral: true
            })
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