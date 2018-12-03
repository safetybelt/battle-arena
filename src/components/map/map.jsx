import React from 'react';
import PropTypes from 'prop-types';
import { TILES, SPRITE_SIZE } from 'utils';
import './map.scss';

const maps = [
    require('data/maps/cave.json'),
];
const zero = ['DIRT_ROCK', 'DIRT_ROCK_MOSS', 'DIRT_ROCK_MOSS_2', 'ROCK', 'ROCK_MOSS', 'ROCK_MOSS_2', 'DARK_ROCKS', 'LIGHT_ROCKS', 'DIRT_ROCKS', 'LIGHT_BONES', 'BRICK_PILE', 'BONES_1', 'BONES_2', 'BONES_3', 'BONES_4', 'DIRT_BUMPS_1', 'DIRT_BUMPS_2', 'STONE_BUMPS_1', 'STONE_BUMPS_2', 'LIGHT_MUSHROOMS_1', 'LIGHT_MUSHROOMS_2', 'LIGHT_MUSHROOMS_3', 'LIGHT_MUSHROOMS_4', 'RED_MUSHROOMS_1', 'RED_MUSHROOMS_2'];

function getBackgroundPosition(tile) {
    tile = TILES[tile];
    if (!tile || tile.length !== 2) {
        return null;
    }
    const x = tile[0] * (SPRITE_SIZE + 1);
    const y = tile[1] * (SPRITE_SIZE + 1);

    return `-${x}px -${y}px`;
}

function getTileZIndex(tile, i) {
    if (i === 0 || zero.indexOf(tile) >= 0) {
        return null;
    } else {
        return 10;
    }
}

class Map extends React.Component {
    render() {
        const map = maps[0];
        return (
            <div id="map-page">
                <div className="map-wrapper">
                    {map.map((row, i) => (
                        <div key={i} className="map-row">
                            {row.map((cell, j) => !cell.tiles || !cell.tiles.length ? null : (
                                <div key={j} className="map-cell">
                                    {cell.tiles.map((tile, k) => (
                                        <div key={k} className="map-tile-stack" style={{ backgroundPosition: getBackgroundPosition(tile), zIndex: getTileZIndex(tile, k) }}>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Map.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};

export default Map;
