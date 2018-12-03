import { ADD_RAY } from 'actions';
import { SPRITE_SIZE } from 'utils';
import map from 'data/maps/cave.json';

export function getTile(row, col) {
    return map[row][col];
}

export function isTileTraversable(x, y, special) {
    const row = Math.floor(y / SPRITE_SIZE);
    const col = Math.floor(x / SPRITE_SIZE);

    if (row < 0 || row > map.length) {
        return false;
    } else if (col < 0 || col > map[0].length) {
        return false;
    }

    const tile = getTile(row, col);

    if (tile.clip) {
        return false;
    } else if (special === 'underground' && tile.clip === 'low') {
        return false;
    }

    return true;
}

function isHittingPlayer(x, y, players) {
    let id = false;
    players.forEach((player) => {
        if (x >= player.position[0] && x <= player.position[0] + SPRITE_SIZE && y >= player.position[1] && y <= player.position[1] + SPRITE_SIZE) {
            id = player.playerId;
        }
    });
    return id;
}

export function checkLineOfSight(start, end, special = null, maxRange = null, checkPlayerCollision = false) {
    return (dispatch) => {
        const p1Pos = [start[0], start[1]];
        const p2Pos = [end[0], end[1]];
        const result = dispatch(rayCast(p1Pos, p2Pos, special, maxRange, checkPlayerCollision));
        return result;
    }
}

export function checkPlayerLineOfSight(player1, player2, special = null, maxRange = null) {
    return (dispatch) => {
        const p1Pos = [player1.position[0] + SPRITE_SIZE / 2, player1.position[1] + SPRITE_SIZE / 2];
        const p2Pos = [player2.position[0] + SPRITE_SIZE / 2, player2.position[1] + SPRITE_SIZE / 2];
        const result = dispatch(rayCast(p1Pos, p2Pos, special, maxRange, false, player1.playerId, player2.playerId));
        return result;
    }
}

// BRESENHAM
function swap(a, b) {
    return [b, a];
}

function BresenhamLine(x0, y0, x1, y1) {
    const result = [];

    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    if (steep) {
        [x0, y0] = swap(x0, y0);
        [x1, y1] = swap(x1, y1);
    }
    if (x0 > x1) {
        [x0, x1] = swap(x0, x1);
        [y0, y1] = swap(y0, y1);
    }

    const deltaX = x1 - x0;
    const deltaY = Math.abs(y1 - y0);
    let error = 0;
    let y = y0;
    const yStep = y0 < y1 ? 1 : -1;

    for (let x = x0; x < x1; x++) {
        if (steep) {
            result.push([y, x]);
        } else {
            result.push([x, y]);
        }
        error += deltaY;
        if (2 * error >= deltaX) {
            y += yStep;
            error -= deltaX;
        }
    }
    return result;
}

// PID is included to specify an ID to attach the ray to (for drawing the result on the map)
function rayCast(start, end, special, maxRange = null, checkPlayerCollision = false, pid1 = null, pid2 = null) {
    return (dispatch, getState) => {
        const players = getState().players;
        const result = { doCollide: false, position: null };
        const ray = BresenhamLine(start[0], start[1], end[0], end[1], maxRange);

        let reverse = false;
        let rayIdx = 0;

        if (ray.length) {
            if (ray[0][0] !== start[0] || ray[0][1] !== start[1]) {
                rayIdx = ray.length - 1;
                reverse = true;
            }

            while (!result.doCollide && !result.maxReached && (reverse ? rayIdx > 0 : rayIdx < ray.length)) {
                const tile = ray[rayIdx];

                if (checkPlayerCollision) {
                    const collision = isHittingPlayer(tile[0], tile[1], players);
                    if (collision) {
                        result.position = ray[rayIdx];
                        result.doCollide = true;
                        result.playerCollide = collision;
                    }
                }

                if (!isTileTraversable(tile[0], tile[1], special)) {
                    result.position = ray[rayIdx];
                    result.doCollide = true;
                } else if (reverse ? rayIdx <= ray.length - maxRange : rayIdx >= maxRange) {
                    result.position = ray[rayIdx];
                    result.maxReached = true;
                } else if (reverse) {
                    rayIdx--;
                } else {
                    rayIdx++;
                }
            }
        }

        if (rayIdx < ray.length) {
            if (reverse) {
                ray.splice(0, rayIdx);
            } else {
                ray.splice(rayIdx, ray.length - rayIdx);
            }
        }

        if (ray && ray.length && pid1 !== null && pid2 !== null) {
            const pid = `${pid1}-${pid2}-ray`;
            dispatch({
                type: ADD_RAY,
                id: pid,
                ray,
            });
        }

        return result;
    }

}
