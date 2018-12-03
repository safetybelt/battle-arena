/* eslint-disable no-magic-numbers */
export function toRads(angle) {
    angle = angle % 360;
    return angle * (Math.PI / 180);
}

export function toDegs(angle) {
    return angle * 180 / Math.PI;
}

export function getDistance(player1, player2, totalDistance = false) {
    if (!player1 || !player1.position || player1.position.length !== 2 ||
        !player2 || !player2.position || player2.position.length !== 2) {
        return null;
    }
    const x = player1.position[0] - player2.position[0];
    const y = player1.position[1] - player2.position[1];

    return totalDistance ? Math.sqrt(x*x + y*y) : [x, y];    // eslint-disable-line space-infix-ops
}

export function getAngleBetweenPoints(start, end) {
    const deltaX = start[0] - end[0];
    const deltaY = start[1] - end[1];

    const angle = 270 - toDegs(Math.atan2(deltaY, deltaX));

    // return angle;
    return (angle < 0 ? angle + 360 : angle) % 360;
}

export function getAngleFromXYDistances(x, y, xm, ym) {
    const angle = toDegs(Math.atan(y / x));
    if (xm > 0 && ym > 0) {
        return angle;
    } else if (xm > 0 && ym < 0) {
        return angle + 90;
    } else if (xm < 0 && ym < 0) {
        return angle + 180;
    } else {
        return angle + 270;
    }
}
/* eslint-enable */
