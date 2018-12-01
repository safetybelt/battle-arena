import React from 'react';
import PropTypes from 'prop-types';
import { Player, Map } from 'components';
import './game.scss';

class Game extends React.Component {
    state = {
        interval: null,
    }

    componentDidMount() {
        this.startLoop();
    }

    startLoop() {
        this.setState({
            interval: window.setInterval(() => this.props.gameLoop(this.props.players), 500),
        });
    }

    stopLoop() {
        window.clearInterval(this.state.interval);
        this.setState({
            interval: null,
        });
    }

    render() {
        const { players } = this.props;
        return (
            <div id="game-page">
                <button onClick={this.startLoop.bind(this)}>Start Game!</button>
                <button onClick={this.stopLoop.bind(this)}>Stop Game!</button>
                <Map>
                    {players.map((player, i) => (
                        <Player key={i} {...player} />
                    ))}
                </Map>
            </div>
        );
    }
}

Game.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object),
    gameLoop: PropTypes.func,
};

export default Game;
