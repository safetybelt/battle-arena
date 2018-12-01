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

// BRESENHAM
function swap(a, b) {
    return [b, a];
}

function BresenhamLine(x0, y0, x1, y1) {
    const result = [];

    const steep = Math.abs(y1 - y0) > Math.abs(x1, x0);
    if (steep) {
        [x0, y0] = swap(x0, y0);
        [x1, y1] = swap(x1, y1);
    }
    if (x0 > x1) {
        [x0, x1] = swap(x0, x1);
        [y0, y1] = swap(y0, y1);
    }

    const deltaX = x1 - x0;
    const deltaY = Math.abs(y1 - y0);
    let error = 0;
    let y = y0;
    const yStep = y0 < y1 ? 1 : -1;

    for (let x = x0; x < x1; x++) {
        if (steep) {
            result.push([y, x]);
        } else {
            result.push([x, y]);
        }
        error += deltaY;
        if (2 * error >= deltaX) {
            y += yStep;
            error -= deltaX;
        }
    }

    return result;
}

function rayCast()
