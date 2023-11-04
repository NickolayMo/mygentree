import type { CSSProperties } from 'react';
import type { ExtNode, Node } from '../renderTree/types';
import { NODE_HEIGHT, NODE_WIDTH } from '../components/const';

export function getNodeStyle({ left, top }: Readonly<ExtNode>): CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}

export function getPersonName(node?: Node): string {
  if(!node) {
    return ""
  }
  return `${node.infoNode?.firstName ?? ""} ${node.infoNode?.middleName ?? ""} ${node.infoNode?.lastName ?? ""}`;
}

