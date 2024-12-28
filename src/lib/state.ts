import type { UnitSystem } from './convert';

import { persisted } from 'svelte-persisted-store';

export const unitSystemStore = persisted<UnitSystem>('unitSystem', 'imperial');
