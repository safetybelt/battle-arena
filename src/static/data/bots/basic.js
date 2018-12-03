import { getAngleBetweenPoints, getDistance } from 'utils';

const safeDistance = 75;
const maxDistance = 100;

/* eslint-disable complexity, no-magic-numbers */
export default class BasicAI {
    idle(self) {
        // check to see our last direction, go in the same general direction; if we're colliding with something, reverse direction; if we have no direction, pick one randomly
        let direction = 0;
        if (!self.direction) {
            direction = Math.random() * 360;
        } else if (self.collided) {
            direction = (self.direction + 180) % 360;
        } else {
            const mod = Math.random() < 0.5 ? -1 : 1;
            direction = (mod * (self.direction + Math.random() * 15)) % 360;
        }

        const speed = 5;

        return { direction, speed };
    }

    getMovementFromEnemy(self, enemy) {
        let speed = 5;

        if (self.collided) {
            const mod = Math.random() < 0.5 ? -1 : 1;
            const direction = (mod * (self.direction + Math.random() * 90)) % 360;
            return { direction, speed };
        }

        const distance = getDistance(self, enemy, true);
        let direction = getAngleBetweenPoints(self.position, enemy.position);

        if (distance < safeDistance) {
            direction = (direction + 180) % 360;
        } else if (distance < maxDistance) {
            speed = 1;
        }

        return {
            direction,
            speed,
        };
    }

    // basic movement tries to keep enemies at a safe distance but not too far as to not be able to fire projectiles
    movement(self, enemies = []) {
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
