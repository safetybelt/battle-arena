import { checkLineOfSight, movePlayer } from 'actions';
import { SPRITE_SIZE } from 'utils';
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

// enemy list includes any player that isn't matched to currnet playerId and is visible to playerId
function getEnemyList(players, player) {
    return (dispatch) => {
        return players.filter((enemy) => {
            if (player.playerId === enemy.playerId) {
                return false;
            };
            const LOSResult = dispatch(checkLineOfSight(player, enemy));
            return LOSResult && !LOSResult.doCollide;
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
            dispatch(handleBrain(player));
        })
    };
}
