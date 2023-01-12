import { ActionRowBuilder } from 'discord.js'

/*function disableButtons(components: any) {
    for (let x = 0; x < components.length; x++) {
        components[x].data.disabled = true
    }
    return components;
}*/

function disableButtons(components: any) {
    for (let x = 0; x < components.length; x++) {
        // @ts-ignore
        components[x].setDisabled(true)
    }
    return new ActionRowBuilder().setComponents(components)
}

export default disableButtons