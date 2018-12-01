import { connect } from 'react-redux';
import { Game } from 'components';
import { tick } from 'actions';

const mapStateToProps = (state) => ({
    players: state.players,
});

const mapDispatchToProps = (dispatch) => ({
    gameLoop: (players) => {
        dispatch(tick());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
