import React from 'react';
import PropTypes from 'prop-types';
import './player.scss';

const TILES = require('data/tiles.js');
const SPRITE_SIZE = 17;         // 16 px square with 1 px margin between each

function getBackgroundPosition(tile) {
    tile = TILES[tile];
    if (!tile || tile.length !== 2) {
        return null;
    }
    const x = tile[0] * SPRITE_SIZE;
    const y = tile[1] * SPRITE_SIZE;

    return `-${x}px -${y}px`;
}

const Player = ({ position, tiles }) => (
    <div className="player" style={{ left: position[0], top: position[1] }}>
        {tiles.map((tile, i) => (
            <div key={i} className="player-tile-stack" style={{ backgroundPosition: getBackgroundPosition(tile)}}></div>
        ))}
    </div>
);

Player.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number),
    tiles: PropTypes.arrayOf(PropTypes.string),
};

export default Player;
