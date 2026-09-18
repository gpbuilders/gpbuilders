import * as migration_20260825_032057_initial from './20260825_032057_initial';
import * as migration_20260915_185051_posts from './20260915_185051_posts';
import * as migration_20260918_182710_hero_media from './20260918_182710_hero_media';
import * as migration_20260918_183317_hero_media from './20260918_183317_hero_media';

export const migrations = [
  {
    up: migration_20260825_032057_initial.up,
    down: migration_20260825_032057_initial.down,
    name: '20260825_032057_initial',
  },
  {
    up: migration_20260915_185051_posts.up,
    down: migration_20260915_185051_posts.down,
    name: '20260915_185051_posts',
  },
  {
    up: migration_20260918_182710_hero_media.up,
    down: migration_20260918_182710_hero_media.down,
    name: '20260918_182710_hero_media',
  },
  {
    up: migration_20260918_183317_hero_media.up,
    down: migration_20260918_183317_hero_media.down,
    name: '20260918_183317_hero_media'
  },
];
