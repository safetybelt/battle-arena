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
            interval: window.setInterval(() => this.props.gameLoop(this.props.players), 1000),
        });
    }

    stopLoop() {
        window.clearInterval(this.state.interval);
        this.setState({
            interval: null,
        });
    }

    render() {
        const { game, players } = this.props;
        return (
            <div id="game-page">
                <button onClick={this.startLoop.bind(this)}>Start Game!</button>
                <button onClick={this.stopLoop.bind(this)}>Stop Game!</button>
                <Map>
                    {players.map((player, i) => (
                        <Player key={i} {...player} />
                    ))}
                    {game && game.rays && Object.keys(game.rays).map((k) => (
                        game.rays[k].map((point, i) => (
                            <div key={i} className="point" style={{ left: point[0], top: point[1] }}></div>
                        ))
                    ))}
                </Map>
            </div>
        );
    }
}

Game.propTypes = {
    game: PropTypes.shape({
        ray: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    }),
    players: PropTypes.arrayOf(PropTypes.object),
    gameLoop: PropTypes.func,
};

export default Game;
