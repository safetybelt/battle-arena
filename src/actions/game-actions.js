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

function movement(players) {
    return (dispatch) => {
        players.forEach((player) => {
            const bot = getBotClass(player);

            const enemies = players.filter((p) => p.playerId !== player.playerId);
            const movement = bot.movement(player, enemies);

            dispatch(movePlayer(player.playerId, movement.direction, movement.speed));
        });
    };
}

export function tick() {
    return (dispatch, getState) => {
        const state = getState();
        const players = state.players;

        dispatch(movement(players));
    };
}
