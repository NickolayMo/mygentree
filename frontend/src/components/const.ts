import type { Node } from 'relatives-tree/lib/types';
import { averageTree } from './sourceExample';

export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 50;

export const SOURCES = {
  'average-tree.json': averageTree
} as Readonly<{ [key: string]: readonly Readonly<Node>[] }>;

export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];

export const URL_LABEL = 'URL (Gist, Paste.bin, ...)';
