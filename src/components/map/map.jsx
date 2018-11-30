import React from 'react';
import PropTypes from 'prop-types';
import './map.scss';

const maps = [
    require('data/maps/default.json'),
];
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
                                        <div key={k} className="map-tile-stack" style={{ backgroundPosition: getBackgroundPosition(tile) }}>
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
