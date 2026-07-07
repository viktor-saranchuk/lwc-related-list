export const areArraysEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
}


export const calculateDelay = (diffMs) => {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    let delay;

    if (diffHours < 1) {
        delay = 1000 * 60;
    } else if (diffHours < 24) {
        delay = 1000 * 60 * 60;
    } else {
        return;
    }

    return delay;
}
