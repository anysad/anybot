import { Queue } from "distube";
import parseMS from "./parseMS";
import buildTimeCode from "./buildTimeCode";

function getPlayerTimeStamp(queue: Queue) {
    const currentStreamTime = queue.currentTime*1000;
    const totalTime = queue.songs[0].duration*1000;

    const currentTimecode = buildTimeCode(parseMS(currentStreamTime));
    const endTimecode = buildTimeCode(parseMS(totalTime));

    return {
        current: currentTimecode,
        end: endTimecode,
        progress: Math.round((currentStreamTime / totalTime) * 100)
    };
}

export default getPlayerTimeStamp;