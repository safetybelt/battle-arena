import { SPRITE_SIZE, getAngleBetweenPoints, getDistance } from 'utils';

const safeDistance = 80;
const maxDistance = 125;

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
            direction = (mod * (self.direction + Math.random() * 5)) % 360;
        }

        const speed = 3;

        return { direction, speed };
    }

    getMovementFromEnemy(self, enemy) {
        let speed = 3;

        if (self.collided) {
            const mod = Math.random() < 0.5 ? -1 : 1;
            const direction = (mod * (self.direction + Math.random() * 90)) % 360;
            return { direction, speed };
        }

        const distance = getDistance(self.position, enemy.position, true);
        let direction = getAngleBetweenPoints(self.position, enemy.position);

        if (distance < safeDistance) {
            const mod = Math.random() < 0.5 ? -1 : 1;
            direction = (mod * (direction + 180 + Math.random() * 45)) % 360;
            speed = 4;
        } else if (distance < maxDistance) {
            const mod = Math.random() < 0.2 ? -1 : 1;
            direction = (mod * (self.direction + 45)) % 360;
        }

        return {
            direction,
            speed,
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

    // basic movement tries to keep enemies at a safe distance but not too far as to not be able to fire projectiles
    movement(self, enemies = []) {
        const enemy = this.getClosestEnemy(self, enemies);
        if (enemy) {
            return this.getMovementFromEnemy(self, enemy);
        } else {
            return this.idle(self);
        }
    }

    attack(self, enemies = []) {
        const enemy = this.getClosestEnemy(self, enemies);

        // projectiles have a max range and can only have one of each type out at a time, so only attack when it's worth it
        if (enemy) {
            const distance = getDistance(self.position, enemy.position, true);
            const position = [enemy.position[0] + SPRITE_SIZE / 2, enemy.position[1] + SPRITE_SIZE / 2];

            if (distance < maxDistance) {
                return {
                    target: position,
                    type: 'projectile',
                };
            }
        }
        return null;
    }
}
/* eslint-enable */
