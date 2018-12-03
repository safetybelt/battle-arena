import { FIRE_PROJECTILE, PROJECTILE_HIT, REMOVE_PROJECTILE, UPDATE_PROJECTILE, checkLineOfSight, checkPlayerLineOfSight, movePlayer } from 'actions';
import { SPRITE_SIZE, getDistance, getAngleBetweenPoints, toRads } from 'utils';
import BasicBot from 'data/bots/basic';
import AggressiveBot from 'data/bots/aggressive';

const Basic = new BasicBot();
const Aggressive = new AggressiveBot();

function getBotClass(player) {
    switch (player.bot) {
        case 'aggressive':
            return Aggressive;
        case 'basic':
        default:
            return Basic;
    }
}

// for now, this just exists to clear brain storage after a set amount of rounds
function handleBrain(player) {
    return (dispatch) => {
    }
}

function movement(player, enemies) {
    return (dispatch) => {
        const bot = getBotClass(player);
        const movement = bot.movement(player, enemies);

        dispatch(movePlayer(player.playerId, movement.direction, movement.speed));
    };
}

function attack(player, enemies) {
    return (dispatch) => {
        const bot = getBotClass(player);
        const attack = bot.attack(player, enemies);

        if (attack && attack.type === 'projectile') {
            dispatch(fireProjectile(player.playerId, attack.target));
        } else if (attack && attack.type === 'melee') {
            // dispatch melee attack...
        }
    }
}

function handleProjectiles(players) {
    return (dispatch) => {
        players.forEach((player) => {
            player.projectiles.forEach((p) => {
                dispatch(getProjectileLocation(player.playerId, p));
            });
        });
    }
}

function getProjectileLocation(playerId, projectile) {
    const { position, target, maxRange, speed, start } = projectile;
    return (dispatch) => {
        if (position[0] !== start[0] || position[1] !== start[1]) {
            const LOSResult = dispatch(checkLineOfSight(position, target, null, speed, true));
            if (LOSResult && LOSResult.doCollide) {
                currentLocation = LOSResult.position;
                if (LOSResult.playerCollide) {
                    return dispatch(projectileHitPlayer(playerId, projectile.type, LOSResult.playerCollide));
                } else {
                    return dispatch(removeProjectile(playerId, projectile.type));
                }
            }
        }

        let currentLocation = position;
        const direction = toRads(getAngleBetweenPoints(currentLocation, target));

        const x = Math.round(Math.sin(direction) * speed);
        const y = Math.round(Math.cos(direction) * speed);

        currentLocation = [currentLocation[0] + x, currentLocation[1] + y];
        const distance = getDistance(currentLocation, start, true);

        if (distance >= maxRange) {
            return dispatch(removeProjectile(playerId, projectile.type));
        }

        return dispatch({
            type: UPDATE_PROJECTILE,
            playerId,
            projectileType: projectile.type,
            position: currentLocation,
        });
    };
}

function projectileHitPlayer(firedByPlayer, type, hitPlayer) {
    return ({
        type: PROJECTILE_HIT,
        fired: firedByPlayer,
        projectileType: type,
        hit: hitPlayer,
    });
}

function removeProjectile(playerId, type) {
    return {
        type: REMOVE_PROJECTILE,
        playerId,
        projectileType: type,
    };
}

// enemy list includes any player that isn't matched to currnet playerId and is visible to playerId
function getEnemyList(players, player, visionRange = 125) {
    return (dispatch) => {
        return players.filter((enemy) => {
            if (player.playerId === enemy.playerId) {
                return false;
            };
            const LOSResult = dispatch(checkPlayerLineOfSight(player, enemy, null, visionRange));
            return LOSResult && !LOSResult.doCollide && !LOSResult.maxReached;
        });
    }
}

export function fireProjectile(playerId, target, damage = 5, maxRange = 100, speed = 17, type = null) {
    return (dispatch, getState) => {
        const players = getState().players;
        const player = players.find((p) => p.playerId === playerId) || { position: [] };

        const position = [player.position[0] + (SPRITE_SIZE / 2), player.position[1] + (SPRITE_SIZE / 2)];
        const direction = toRads(getAngleBetweenPoints(position, target));

        const x = Math.round(Math.sin(direction) * 1000);
        const y = Math.round(Math.cos(direction) * 1000);

        const finalTarget = [target[0] + x, target[1] + y]

        return !player ? null : dispatch({
            type: FIRE_PROJECTILE,
            playerId,
            target: finalTarget,
            maxRange,
            damage,
            position: position,
            start: position,
            speed,
            projectileType: 'projectile',
        });
    }
}

export function tick() {
    return (dispatch, getState) => {
        const state = getState();
        const players = state.players;

        players.forEach((player) => {
            const enemies = dispatch(getEnemyList(players, player));
            dispatch(movement(player, enemies));
            dispatch(attack(player, enemies));
            dispatch(handleBrain(player));
            dispatch(handleProjectiles(players));
        })
    };
}
