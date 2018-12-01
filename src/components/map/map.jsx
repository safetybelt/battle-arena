import React from 'react';
import PropTypes from 'prop-types';
import { TILES, SPRITE_SIZE } from 'utils';
import './map.scss';

const maps = [
    require('data/maps/default.json'),
];

function getBackgroundPosition(tile) {
    tile = TILES[tile];
    if (!tile || tile.length !== 2) {
        return null;
    }
    const x = tile[0] * (SPRITE_SIZE + 1);
    const y = tile[1] * (SPRITE_SIZE + 1);

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
