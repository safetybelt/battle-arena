import { getAngleFromXYDistances, getDistance } from 'utils';

const safeDistance = 50;
const maxDistance = 75;

/* eslint-disable complexity */
export default class BasicAI {
    getMovementFromEnemy(self, enemy) {
        const [xd, yd] = getDistance(self, enemy);
        let x = 0;
        let y = 0;
        let xm = 1;
        let ym = 1;

        if (enemy.distance < safeDistance) {
            if (self.position[0] < enemy.position[0]) {
                xm = -1;
            }
            if (self.position[1] < enemy.position[1]) {
                ym = -1;
            }
            if (xd > yd) {
                x -= yd === 0 ? 1 : xd / yd;
                y -= 1;
            } else {
                x -= 1;
                y -= xd === 0 ? 1 : yd / xd;
            }
        } else if (enemy.distance > maxDistance) {
            if (self.position[0] > enemy.position[0]) {
                xm = -1;
            }
            if (self.position[1] > enemy.position[1]) {
                ym = -1;
            }
            if (xd > yd) {
                x += yd === 0 ? 1 : xd / yd;
                y += 1;
            } else {
                x += 1;
                y += xd === 0 ? 1 : yd / xd;
            }
        }

        const direction = getAngleFromXYDistances(Math.abs(x), Math.abs(y), xm, ym);
        const speed = 5;

        return { direction, speed };
    }

    // basic movement tries to keep enemies at a safe distance but not too far as to not be able to fire projectiles
    movement(self, enemies) {
        let mainEnemy = null;
        // only deal with the closest enemy
        enemies.forEach((enemy) => {
            const distance = getDistance(self, enemy, true);
            if (!mainEnemy || distance < mainEnemy.distance) {
                mainEnemy = Object.assign({ distance }, enemy);
            }
        });

        return this.getMovementFromEnemy(self, mainEnemy);
    }
}
/* eslint-enable */
