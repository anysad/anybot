import { CommandObject, CommandType, CommandUsage } from 'wokcommands'
import { EmbedBuilder, ApplicationCommandOptionType } from 'discord.js'
import axios from 'axios'
import 'dotenv/config'
import { randomInt } from 'crypto'

export default {
    category: 'Fun',
    type: CommandType.SLASH,
    description: 'Search up a recipe by its name.',
    guildOnly: true,
    options: [
        { name: 'recipe', description: 'The recipe to search for.', type: ApplicationCommandOptionType.String, required: true }
    ],

    callback: async (options: CommandUsage) => {
        try {
            var recipestuff = await axios.get('https://api.api-ninjas.com/v1/recipe?query=' + options.interaction?.options.get('recipe')?.value, {
                // @ts-ignore
                headers: { 'X-Api-Key': process.env['FUN_API_KEY'] }
            })
            var randomInteger = randomInt(recipestuff.data.length)
            var recipe = recipestuff.data[randomInteger];
            var ingredients = recipe.ingredients.replaceAll('|', '\n').split('\n');
            
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('**' + recipe.title + '**')
                .setDescription('Instructions: ' + recipe.instructions)
                .setFooter({ text: `Requested by ${options.member?.user.tag}`, iconURL: options.interaction?.user.displayAvatarURL() })
                ingredients.forEach((ingredient: any) => {
                    embed.addFields(
                        { name: 'Ingredient', value: ingredient, inline: true }
                    )
                })
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