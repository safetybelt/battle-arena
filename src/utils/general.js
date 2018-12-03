/* eslint-disable no-magic-numbers */
export function toRads(angle) {
    angle = angle % 360;
    return angle * (Math.PI / 180);
}

export function toDegs(angle) {
    return angle * 180 / Math.PI;
}

export function getDistance(start, end, totalDistance = false) {
    if (start.length !== 2 || end.length !== 2) {
        return null;
    }
    const x = start[0] - end[0];
    const y = start[1] - end[1];

    return totalDistance ? Math.sqrt(x*x + y*y) : [x, y];    // eslint-disable-line space-infix-ops
}

export function getAngleBetweenPoints(start, end) {
    const deltaX = start[0] - end[0];
    const deltaY = start[1] - end[1];

    const angle = 270 - toDegs(Math.atan2(deltaY, deltaX));

    // return angle;
    return (angle < 0 ? angle + 360 : angle) % 360;
}
/* eslint-enable */
