import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import type { Node } from '../../renderTree/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { getPersonName } from '../../utils/utils';

interface NodeDetailsProps {
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEdit: (isVisible: boolean) => void;
  onCreate: (isVisible: boolean) => void;
}

export const NodeDetails = memo(
  function NodeDetails({nodeList, node, className, ...props }: NodeDetailsProps) {
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
    const deleteNodeHandler = useCallback(() => props.onDelete(), [props]);
    const editUserHandler = useCallback(() => props.onEdit(true), [props])
    const createUserHandler = useCallback(() => props.onCreate(true), [props])
    console.log(props)

    async function editUserCallback() {
      editUserHandler()
    }
    async function createUserCallback() {
      createUserHandler()
    }

    async function deleteUserCallback() {
      fetch(
        process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/update/person",
        {
          method: "POST",
          body: JSON.stringify({
            "userId": "HkqEDLvxE",
            "treeId": "1",
            "action": "DELETE",
            "nodeId": node.id,
            "context": {
            }
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then((res) => res.json())
        .then((res) => res.data)
        .then((res) => deleteNodeHandler())
    }


    return (
      <section className={classNames(css.root, className)}>
        <div>{node.id}</div>
         <button className={css.reset} onClick={deleteUserCallback}>
          удалить
        </button>
        <button className={css.reset} onClick={editUserCallback}>
          Редактировать
        </button>
        <button className={css.reset} onClick={createUserCallback}>
          Добавить родственника
        </button>
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
