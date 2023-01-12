import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import axios from 'axios'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Get all of the information about covid-19.',
    guildOnly: true,
    options: [
        { name: 'country', description: 'The country to get the information for.', type: ApplicationCommandOptionType.String, required: false }
    ],

    callback: async (options: CommandUsage) => {
        try {
            var country = options.interaction?.options.get('country')?.value
            var link;
            if(!country)
                link = 'https://disease.sh/v3/covid-19/all';
            else
                link = 'https://disease.sh/v3/covid-19/countries/' + country;

            var stuff = await axios.get(link)
            var information = stuff.data

            var embed = new EmbedBuilder()
            if(country) {
                embed
                .setColor('Random')
                .setTitle('Information for **' + information.country + '**')
                .addFields(
                    // @ts-ignore
                    { name: 'Total Cases', value: information.cases.toString(), inline: true },
                    { name: 'Cases Today', value: information.todayCases.toString(), inline: true },
                    { name: 'Total Deaths', value: information.deaths.toString(), inline: true },
                    { name: 'Deaths Today', value: information.todayDeaths.toString(), inline: true },
                    { name: 'Recovered', value: information.recovered.toString(), inline: true },
                    { name: 'Active', value: information.active.toString(), inline: true },
                    { name: 'Critical', value: information.critical.toString(), inline: true },
                    { name: 'Tests', value: information.tests.toString(), inline: true },
                    { name: 'Tests Per One Million', value: information.testsPerOneMillion.toString(), inline: true },
                )
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                .setThumbnail(information.countryInfo.flag)
            } else {
                embed
                .setColor('Random')
                .setTitle('Information Worldwide')
                .addFields(
                    // @ts-ignore
                    { name: 'Total Cases', value: information.cases.toString(), inline: true },
                    { name: 'Cases Today', value: information.todayCases.toString(), inline: true },
                    { name: 'Total Deaths', value: information.deaths.toString(), inline: true },
                    { name: 'Deaths Today', value: information.todayDeaths.toString(), inline: true },
                    { name: 'Recovered', value: information.recovered.toString(), inline: true },
                    { name: 'Active', value: information.active.toString(), inline: true },
                    { name: 'Critical', value: information.critical.toString(), inline: true },
                    { name: 'Tests', value: information.tests.toString(), inline: true },
                    { name: 'Tests Per One Million', value: information.testsPerOneMillion.toString(), inline: true },
                )
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
            }
            return options.interaction?.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e)
            if(e == 'AxiosError: Request failed with status code 404') return options.interaction?.reply({
                embeds: [new EmbedBuilder()
                    .setTitle(`⛔ | Error`)
                    .setColor('Red')
                    .setDescription(`The country you entered was not found.`)
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