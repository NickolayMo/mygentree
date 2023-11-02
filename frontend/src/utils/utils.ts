import type { CSSProperties } from 'react';
import type { ExtNode, Node } from '../renderTree/types';
import { NODE_HEIGHT, NODE_WIDTH } from '../components/const';
import { fetchData } from './fetchData';
import { getTreeRoute } from './routes';

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

export function getInitData(): any {
  return fetchData(
    process.env.REACT_APP_TREE_APP_SERVICE_URL + getTreeRoute,
    {
      method: "POST",
      body: JSON.stringify({ userId: 1, treeId: 1 }),
      headers: {
        "Content-Type": "application/json",
      }
    }
  )
}