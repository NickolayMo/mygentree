import { memo, useCallback } from 'react';
import { Relation, Node } from '../../renderTree/types';
import css from './Relations.module.css';
import { getPersonName } from '../../utils/utils';

interface RelationsProps {
  title: string;
  items: readonly Relation[];
  nodeList: ReadonlyArray<Node>;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
}

export const Relations = memo(
  function Relations({title, items, nodeList, onSelect, onHover, onClear}: RelationsProps) {
    const selectHandler = useCallback((id: string) => () => onSelect(id), [onSelect]);
    const hoverHandler = useCallback((id: string) => () => onHover(id), [onHover]);
    const clearHandler = useCallback(() => onClear(), [onClear]);
    const findNode = (selectId:String): Node | undefined => {
      return nodeList.find(item => item.id === selectId)
    };
    if (!items.length) return null;
    return (
      <div>
        <h4>{title}</h4>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={css.item}
            onClick={selectHandler(item.id)}
            onMouseEnter={hoverHandler(item.id)}
            onMouseLeave={clearHandler}
          >
            {getPersonName(findNode(item.id))} <div hidden>{item.id}</div>
          </div>
        ))}
      </div>
    );
  },
);
