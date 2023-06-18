import type { Node } from '../renderTree/types';
import { averageTree } from './sourceExample';

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 100;

export const URL_LABEL = 'URL (Gist, Paste.bin, ...)';
export const EXT_LOAD_LABEL = 'load from backend';

export const SOURCES = {
  'average-tree.json': averageTree
} as Readonly<{ [key: string]: readonly Readonly<Node>[] }>;
export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];