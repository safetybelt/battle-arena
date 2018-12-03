import { FIRE_PROJECTILE, PROJECTILE_HIT, REMOVE_PROJECTILE, UPDATE_PROJECTILE, MOVE_PLAYER, UPDATE_PLAYER_HEALTH } from 'actions';

const initialState = [{
    playerId: 'defaultUser',
    position: [200, 200],        // eslint-disable-line no-magic-numbers
    health: 150,
    maxHealth: 150,
    tiles: ['PLAYER_1'],
    brain: {},
    projectiles: [],
}, {
    playerId: 'ai',
    position: [50, 50],
    health: 150,
    maxHealth: 150,
    tiles: ['PLAYER_2'],
    bot: 'aggressive',
    brain: {},
    projectiles: [],
// }, {
//     playerId: 'testUser',
//     position: [200, 200],
//     health: 150,
//     maxHealth: 150,
//     tiles: ['PLAYER_3'],
//     brain: {},
//     projectiles: [],
}];

function fireProjectile(state, playerId, target, maxRange, damage, position, speed, type) {
    const playerIdx = state.findIndex((p) => playerId === p.playerId);
    if (playerIdx < 0) {
        return state;
    }

    // don't allow the user to fire more than one of a certain projectile type at a time
    const projectiles = state[playerIdx].projectiles;
    if (projectiles.findIndex((p) => p.type === type) >= 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    copy[playerIdx].projectiles.push({
        target,
        maxRange,
        damage,
        position,
        speed,
        type,
        start: position,
    });

    return copy;
}

function handleTakeDamage(stateCopy, pIdx, damage) {
    stateCopy[pIdx].health -= damage;
    if (stateCopy[pIdx].health <= 0) {
        stateCopy.splice(pIdx, 1);
    }
}

function handleProjectileHit(state, fired, type, hit) {
    let firedIdx = -1;
    let hitIdx = -1;
    state.forEach((p, i) => {
        if (p.playerId === fired) {
            firedIdx = i;
        } else if (p.playerId === hit) {
            hitIdx = i;
        }
    });

    if (firedIdx < 0 || hitIdx < 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    const projIdx = copy[firedIdx].projectiles.findIndex((p) => p.type === type);


    if (projIdx >= 0) {
        const dmg = copy[firedIdx].projectiles[projIdx].damage;
        copy[firedIdx].projectiles.splice(projIdx, 1);
        handleTakeDamage(copy, hitIdx, dmg);
    }

    return copy;
}

function handleRemoveProjectile(state, pid, type) {
    const playerIdx = state.findIndex((p) => pid === p.playerId);
    if (playerIdx < 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    const projIdx = copy[playerIdx].projectiles.findIndex((p) => p.type === type);
    if (projIdx >= 0) {
        copy[playerIdx].projectiles.splice(projIdx, 1);
    }

    return copy;
}

function handleUpdateProjectile(state, pid, type, position) {
    const playerIdx = state.findIndex((p) => pid === p.playerId);
    if (playerIdx < 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    const projIdx = copy[playerIdx].projectiles.findIndex((p) => p.type === type);
    if (projIdx >= 0) {
        copy[playerIdx].projectiles[projIdx].position = position;
    }

    return copy;
}

function movePlayer(state, playerId, position, direction, speed, collided) {
    const playerIdx = state.findIndex((p) => playerId === p.playerId);
    if (playerIdx < 0) {
        return state;
    }

    const copy = JSON.parse(JSON.stringify(state));
    Object.assign(copy[playerIdx], {
        position,
        direction,
        speed,
        collided,
    });
    return copy;
}

function updatePlayerHealth(state, playerId, health) {
    return state;
}

export function players(state = initialState, action) {
    switch (action.type) {
        case FIRE_PROJECTILE:
            return fireProjectile(state, action.playerId, action.target, action.maxRange, action.damage, action.position, action.speed, action.projectileType);
        case PROJECTILE_HIT:
            return handleProjectileHit(state, action.fired, action.projectileType, action.hit);
        case REMOVE_PROJECTILE:
            return handleRemoveProjectile(state, action.playerId, action.projectileType);
        case UPDATE_PROJECTILE:
            return handleUpdateProjectile(state, action.playerId, action.projectileType, action.position);
        case MOVE_PLAYER:
            return movePlayer(state, action.playerId, action.position, action.direction, action.speed, action.collided);
        case UPDATE_PLAYER_HEALTH:
            return updatePlayerHealth(state, action.playerId, action.health);
        default:
            return state;
    }
}
