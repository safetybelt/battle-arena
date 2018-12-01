import { ADD_TO_BRAIN, REMOVE_FROM_BRAIN, MOVE_PLAYER, UPDATE_PLAYER_HEALTH } from 'actions';
import { SPRITE_SIZE, getXYMods, toRads } from 'utils';
import map from 'data/maps/default.json';

export const MIN_SPEED = 0;
export const MAX_SPEED = 5;
export const MAX_DIRECTION = 360;

// const map = require('data/maps/default.json');

/* eslint-disable complexity */
function checkClipping(x, y, xm, ym) {
    const row = Math.floor(y / SPRITE_SIZE);
    const col = Math.floor(x / SPRITE_SIZE);
    const cell = map[row] && map[row][col];

    if (!cell) {
        return false;
    } else if (cell && !cell.clip) {
        return [x, y];
    }

    // check the opposite direction of xm and ym to update coordinates that work
    const newX = x - (SPRITE_SIZE + (x % SPRITE_SIZE) + 1) * -xm;
    const newY = y - (SPRITE_SIZE + (y % SPRITE_SIZE) + 1) * -ym;
    const newRow = Math.floor(newY / SPRITE_SIZE);
    const newCol = Math.floor(newX / SPRITE_SIZE);

    let check = map[newRow] && map[newRow][col];
    if (check && !check.clip) {
        return [x, newY];
    }

    check = map[row][newCol];
    if (check && !check.clip) {
        return [newX, y];
    }

    check = map[newRow] && map[newRow][newCol];
    if (check && !check.clip) {
        return [newX, newY];
    }

    return false;
}

function enforceClipping(position, xm, ym) {
    const [x, y] = position;

    if (xm > 0 || ym > 0) {
        const origin = checkClipping(x + SPRITE_SIZE, y + SPRITE_SIZE, xm, ym);
        if (!origin) { return false; }
        const [mx, my] = origin;
        return [mx - SPRITE_SIZE, my - SPRITE_SIZE];
    } else {
        return checkClipping(x, y, xm, ym);
    }
}

function calculateNewPosition(position, direction, speed) {
    /* eslint-disable no-magic-numbers */
    const { xm, ym } = getXYMods(direction);

    direction = toRads(direction);
    /* eslint-enable */

    const x = Math.round(Math.sin(direction) * speed);
    const y = Math.round(Math.cos(direction) * speed);

    const origin = enforceClipping([position[0] + x, position[1] + y], xm, ym);

    return origin || position;
}

// direction: 0-360 degrees
// 0 is straight left; 90 straight up; 180 straight right; 270 straight down
export function movePlayer(playerId, direction, speed) {
    speed = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
    direction = Math.abs(direction % MAX_DIRECTION);
    return (dispatch, getState) => {
        const state = getState();
        const player = state.players && state.players.find((p) => p.playerId === playerId);
        if (!player) {
            return null;
        }
        return dispatch({
            type: MOVE_PLAYER,
            playerId,
            position: calculateNewPosition(player.position, direction, speed),
        });
    };
}

export function adjustPlayerHealth(playerId, adjustment) {
    return {
        type: UPDATE_PLAYER_HEALTH,
        playerId,
        health: adjustment,
    };
}

export function addToBrain(playerId, key, data) {
    return {
        type: ADD_TO_BRAIN,
        playerId,
        key,
        data,
    };
}

export function removeFromBrain(playerId, key) {
    return {
        type: REMOVE_FROM_BRAIN,
        playerId,
        key,
    };
}
