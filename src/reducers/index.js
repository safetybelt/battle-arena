import { errors } from 'reducers/error-reducer';
import { game } from 'reducers/game-reducer';
import { loading } from 'reducers/loading-reducer';
import { players } from 'reducers/player-reducer';

const reducerList = {
    errors,
    game,
    loading,
    players,
};

export default reducerList;
