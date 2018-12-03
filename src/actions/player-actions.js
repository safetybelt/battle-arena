import { ADD_TO_BRAIN, REMOVE_FROM_BRAIN, MOVE_PLAYER, UPDATE_PLAYER_HEALTH } from 'actions';
import { SPRITE_SIZE, toRads } from 'utils';
import map from 'data/maps/default.json';

export const MIN_SPEED = 0;
export const MAX_SPEED = 5;
export const MAX_DIRECTION = 360;

// const map = require('data/maps/default.json');

/* eslint-disable complexity */
function checkClipping(x, y) {
    const row = Math.floor(y / SPRITE_SIZE);
    const col = Math.floor(x / SPRITE_SIZE);
    const cell = map[row] && map[row][col];

    if (cell && !cell.clip) {
        return [x, y];
    }

    return false;
}

function enforceClipping(position) {
    const [x, y] = position;

    const topLeft = checkClipping(x, y);
    const topRight = checkClipping(x + SPRITE_SIZE, y);
    const bottomLeft = checkClipping(x, y + SPRITE_SIZE);
    const bottomRight = checkClipping(x + SPRITE_SIZE, y + SPRITE_SIZE);

    return topRight && bottomLeft && bottomRight && topLeft;
}

function calculateNewPosition(position, direction, speed) {
    /* eslint-disable no-magic-numbers */
    direction = toRads(direction);
    /* eslint-enable */

    const x = Math.round(Math.sin(direction) * speed);
    const y = Math.round(Math.cos(direction) * speed);

    const origin = enforceClipping([position[0] + x, position[1] + y]);

    return {
        position: origin || position,
        collided: !origin,
    };
}

// direction: 0-360 degrees
// 0 is straight down; 90 straight right; 180 straight up; 270 straight left
export function movePlayer(playerId, direction, speed) {
    speed = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
    direction = Math.abs(direction % MAX_DIRECTION);
    return (dispatch, getState) => {
        const state = getState();
        const player = state.players && state.players.find((p) => p.playerId === playerId);
        if (!player) {
            return null;
        }

        const newPos = calculateNewPosition(player.position, direction, speed);

        return dispatch({
            type: MOVE_PLAYER,
            playerId,
            position: newPos.position,
            collided: newPos.collided,
            direction,
            speed,
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
