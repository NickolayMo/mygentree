import type {ExtNode} from 'relatives-tree/lib/types';
export declare type DataExendedNode = ExtNode & Readonly<{
    image?: string
    name?: string
    description?: string
}>;