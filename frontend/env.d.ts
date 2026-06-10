/// <reference types="vite/client" />
/// <reference types="pinia-plugin-persistedstate" />

import 'pinia-plugin-persistedstate';
import type { StateTree } from 'pinia';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: boolean | PersistenceOptions<S> | PersistenceOptions<S>[];
  }
}
