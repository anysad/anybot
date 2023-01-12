import { Queue } from "distube";
import getPlayerTimeStamp from "./getplayertimestamp";

function createProgressBar(queue: Queue) {

    const length = 15;
    const index = Math.round((queue.currentTime*1000 / queue.songs[0].duration*1000) * length);
    const indicator = "🔘";
    const line = "▬";

    if (index >= 1 && index <= length) {
        const bar = line.repeat(length - 1).split("");
        bar.splice(index, 0, indicator);
        const timestamp = getPlayerTimeStamp(queue);
        return `${timestamp.current} ┃ ${bar.join("")} ┃ ${timestamp.end}`;
    } else {
        const timestamp = getPlayerTimeStamp(queue);
        return `${timestamp.current} ┃ ${indicator}${line.repeat(length - 1)} ┃ ${timestamp.end}`;
    }
}

export default createProgressBar;