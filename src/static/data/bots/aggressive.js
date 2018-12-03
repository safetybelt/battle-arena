import { SPRITE_SIZE, getAngleBetweenPoints, getDistance, toRads } from 'utils';

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

        const speed = 2;

        return { direction, speed };
    }

    getMovementFromEnemy(self, enemy) {
        const distance = getDistance(self.position, enemy.position, true);
        const speed = 3;
        const direction = getAngleBetweenPoints(self.position, enemy.position, 'aggro');

        return {
            direction,
            speed: distance < desiredDistance ? 0 : speed,
        };
    }

    getClosestEnemy(self, enemies = []) {
        let mainEnemy = null;
        // only deal with the closest enemy
        enemies.forEach((enemy) => {
            const distance = getDistance(self.position, enemy.position, true);
            if (!mainEnemy || distance < mainEnemy.distance) {
                mainEnemy = Object.assign({ distance }, enemy);
            }
        });

        return mainEnemy;
    }

    // aggressive movement charges at the closest enemy it sees
    movement(self, enemies) {
        const enemy = this.getClosestEnemy(self, enemies);
        if (enemy) {
            return this.getMovementFromEnemy(self, enemy);
        } else {
            return this.idle(self);
        }
    }

    attack(self, enemies = []) {
        const enemy = this.getClosestEnemy(self, enemies);

        // aggressive, just try to fire a projectile whenever we aren't in melee range and melee if we are
        if (enemy) {
            const distance = getDistance(self.position, enemy.position, true);
            const position = [enemy.position[0] + SPRITE_SIZE / 2, enemy.position[1] + SPRITE_SIZE / 2];
            return distance <= desiredDistance ? {
                target: position,
                type: 'melee',
            } : {
                target: position,
                type: 'projectile',
            };
        } else {
            // if we don't have an enemy, shoot randomly
            let direction = Math.random() * 360;
            console.log('direction...', direction);
            direction = toRads(direction);
            console.log('dir...', direction);

            const x = Math.round(Math.sin(direction) * 1000);
            const y = Math.round(Math.cos(direction) * 1000);
            console.log('x, y', x, y);
            return {
                target: [self.position[0] + x, self.position[0] + y],
                type: 'projectile',
            };
        }
    }
}
/* eslint-enable */
