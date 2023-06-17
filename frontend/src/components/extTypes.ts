import type {ExtNode} from '../renderTree/types';
export declare type DataExendedNode = ExtNode & Readonly<{
    image?: string
    firstName: string,
    middleName?: string,
    lastName?: string,
    description?: string
}>;