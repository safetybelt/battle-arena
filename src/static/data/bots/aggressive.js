import { getAngleBetweenPoints, getDistance } from 'utils';

const desiredDistance = 25;

/* eslint-disable complexity,  no-magic-numbers */
export default class AggressiveAI {
    idle(self) {
        // check to see our last direction, go in the same general direction; if we're colliding with something, reverse direction; if we have no direction, pick one randomly
        let direction = 0;
        if (!self.direction) {
            direction = Math.random() * 360;
        } else if (self.collided) {
            direction = (self.direction + 180) % 360;
        } else {
            const mod = Math.random() < 0.5 ? -1 : 1;
            direction = mod * (self.direction + Math.random() * 15);
        }

        const speed = 5;

        return { direction, speed };
    }

    getMovementFromEnemy(self, enemy) {
        const distance = getDistance(self, enemy, true);
        const speed = 5;
        const direction = getAngleBetweenPoints(self.position, enemy.position, 'aggro');

        return {
            direction,
            speed: distance < desiredDistance ? 0 : speed,
        };
    }

    avoidClipping(direction, speed, map) {

    }

    // aggressive movement charges at the closest enemy it sees
    movement(self, enemies) {
        let mainEnemy = null;
        // only deal with the closest enemy
        enemies.forEach((enemy) => {
            const distance = getDistance(self, enemy, true);
            if (!mainEnemy || distance < mainEnemy.distance) {
                mainEnemy = Object.assign({ distance }, enemy);
            }
        });

        if (mainEnemy) {
            return this.getMovementFromEnemy(self, mainEnemy);
        } else {
            return this.idle(self);
        }
    }
}
/* eslint-enable */
