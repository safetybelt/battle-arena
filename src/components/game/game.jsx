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
            interval: window.setInterval(() => this.props.gameLoop(this.props.players), 100),
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
                        <div className={`player-wrapper player-${i}`} key={i}>
                            <Player {...player} />
                            {player.projectiles.map((p, k) => (
                                <div className="projectile" key={k} style={{ left: p.position[0], top: p.position[1] }}></div>
                            ))}
                        </div>
                    ))}
                    {game && game.rays && Object.keys(game.rays).map((k, i) => (
                        <div key={i} className={`ray-wrapper ray-${i}`}>
                            {game.rays[k].map((point, j) => (
                                <div key={j} className="point" style={{ left: point[0], top: point[1] }}></div>
                            ))}
                        </div>
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
