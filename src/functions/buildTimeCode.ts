import { TimeData } from '../interfaces/TimeData'

function buildTimeCode(duration: TimeData) {
    const items = Object.keys(duration);
    const required = ["days", "hours", "minutes", "seconds"];

    const parsed = items.filter((x) => required.includes(x)).map((m) => duration[m as keyof TimeData]);
    const final = parsed
        .slice(parsed.findIndex((x) => x !== 0))
        .map((x) => x.toString().padStart(2, "0"))
        .join(":");

    return final.length <= 3 ? `0:${final.padStart(2, "0") || 0}` : final;
}

export default buildTimeCode;