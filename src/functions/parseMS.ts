import { TimeData } from '../interfaces/TimeData'

function parseMS(milliseconds: number) {
    const round = milliseconds > 0 ? Math.floor : Math.ceil;

    return {
        days: round(milliseconds / 86400000),
        hours: round(milliseconds / 3600000) % 24,
        minutes: round(milliseconds / 60000) % 60,
        seconds: round(milliseconds / 1000) % 60
    } as TimeData;
}

export default parseMS;