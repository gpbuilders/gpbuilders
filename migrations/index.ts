import * as migration_20260825_032057_initial from './20260825_032057_initial';
import * as migration_20260915_185051_posts from './20260915_185051_posts';

export const migrations = [
  {
    up: migration_20260825_032057_initial.up,
    down: migration_20260825_032057_initial.down,
    name: '20260825_032057_initial',
  },
  {
    up: migration_20260915_185051_posts.up,
    down: migration_20260915_185051_posts.down,
    name: '20260915_185051_posts'
  },
];
