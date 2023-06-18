import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import type { Node } from '../../renderTree/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { getPersonName } from '../App/utils';

interface NodeDetailsProps {
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
}

export const NodeDetails = memo(
  function NodeDetails({nodeList, node, className, ...props }: NodeDetailsProps) {
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
    return (
      <section className={classNames(css.root, className)}>
        <header className={css.header}>
          {node.infoNode && node.infoNode.avatar && (
              <div className={css.avatar}>
                <img className={css.avatarImg} src={node.infoNode.avatar} alt='avatar'></img>
              </div>
            )}
          <h3 className={css.title}>{getPersonName(node)}</h3>
          <button className={css.close} onClick={closeHandler}>&#10005;</button>
        </header>
        <Relations {...props} title="Родители" items={node.parents} nodeList={nodeList} />
        <Relations {...props} title="Дети" items={node.children}  nodeList={nodeList} />
        <Relations {...props} title="Братья и сестры" items={node.siblings}  nodeList={nodeList} />
        <Relations {...props} title="Супруги" items={node.spouses}  nodeList={nodeList} />
      </section>
    );
  },
);
