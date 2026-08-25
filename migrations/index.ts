import * as migration_20260825_032057_initial from './20260825_032057_initial';

export const migrations = [
  {
    up: migration_20260825_032057_initial.up,
    down: migration_20260825_032057_initial.down,
    name: '20260825_032057_initial'
  },
];
