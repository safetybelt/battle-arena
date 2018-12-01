import { MOVE_PLAYER, UPDATE_PLAYER_HEALTH } from 'actions';

const initialState = [{
    playerId: 'defaultUser',
    position: [100, 50],        // eslint-disable-line no-magic-numbers
    health: 100,
    tiles: ['PLAYER_1'],
    brain: {},
}, {
    playerId: 'ai',
    position: [200, 200],
    health: 150,
    tiles: ['PLAYER_2'],
    bot: 'aggressive',
    brain: {},
}];

function movePlayer(state, playerId, position) {
    const playerIdx = state.findIndex((p) => playerId === p.playerId);
    if (playerIdx < 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    copy[playerIdx].position = position;
    return copy;
}

function updatePlayerHealth(state, playerId, health) {
    return state;
}

export function players(state = initialState, action) {
    switch (action.type) {
        case MOVE_PLAYER:
            return movePlayer(state, action.playerId, action.position);
        case UPDATE_PLAYER_HEALTH:
            return updatePlayerHealth(state, action.playerId, action.health);
        default:
            return state;
    }
}
