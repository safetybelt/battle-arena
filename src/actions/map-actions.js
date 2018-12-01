import SPRITE_SIZE from 'utils';
import map from 'data/maps/default.json';

export function getTile(row, col) {
    return map[row][col];
}

export function isTileTraversable(x, y, special) {
    const row = Math.floor(y / SPRITE_SIZE);
    const col = Math.floor(x / SPRITE_SIZE);

    if (row < 0 || row > map.length) {
        return false;
    } else if (col < 0 || col > map[0].length) {
        return false;
    }

    const tile = getTile(row, col);

    if (tile.clip) {
        return false;
    } else if (special === 'underground' && tile.clip === 'low') {
        return false;
    }

    return true;
}

export function checkLineOfSight(start, end) {

}
