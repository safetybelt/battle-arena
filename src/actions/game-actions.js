import { movePlayer } from 'actions';
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

function movement(player) {
    return (dispatch) => {
        const bot = getBotClass(player);

        // only give enemy data if they're in line of sight
        const enemies = players.filter((p) => {
            return p.playerId !== player.playerId;
        });
        const movement = bot.movement(player, enemies);

        dispatch(movePlayer(player.playerId, movement.direction, movement.speed));
    };
}

// enemy list includes any player that isn't matched to currnet playerId and is visible to playerId
function getEnemyList(players, playerId) {
    return players.filter((player) => {
        const isEnemy = player.playerId !== playerId;
        const isVisible =
    })
}

export function tick() {
    return (dispatch, getState) => {
        const state = getState();
        const players = state.players;

        players.forEach((player) => {
            const enemies = getEnemyList(players, player.playerId);
            dispatch(movement(player, enemies));
            dispatch(handleBrain(player));
        })
    };
}
