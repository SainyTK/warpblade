import { TARGET_RESPAWN, TRAINING_TARGETS, TRAINING_WAVE } from "../../constants/training";
import type { Enemy } from "../../types/enemy";
import { makeEnemy } from "../enemies/enemy";
import { game, showBanner } from "../state";

interface Post {
  target: (typeof TRAINING_TARGETS)[number];
  enemy: Enemy;
  standsAt: number;
}

const BANNER_TIME = 1.6;

let posts: Post[] | null = null;

function stand(target: Post["target"]): Enemy {
  const enemy = makeEnemy(target.type, target.x, target.y, TRAINING_WAVE, 0);
  game.enemies.push(enemy);
  return enemy;
}

export const isTraining = (): boolean => posts !== null;

export function resetTraining(): void {
  posts = null;
}

export function beginTraining(): void {
  game.wave = TRAINING_WAVE;
  posts = TRAINING_TARGETS.map((target) => ({ target, enemy: stand(target), standsAt: 0 }));
  showBanner("Training ground", BANNER_TIME);
}

export function updateTraining(): void {
  for (const post of posts ?? []) {
    if (post.enemy.hp > 0) {
      continue;
    }
    if (!post.standsAt) {
      post.standsAt = game.t + TARGET_RESPAWN;
    } else if (game.t >= post.standsAt) {
      post.enemy = stand(post.target);
      post.standsAt = 0;
    }
  }
}
