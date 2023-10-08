import { memo, useCallback } from 'react';
import classNames from 'classnames';
import type { Node } from '../../renderTree/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { getPersonName } from '../../utils/utils';
import { deleteUser } from './actions';
import { FormTypes } from '../PersonForm/PersonForm';

interface NodeDetailsProps {
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
  onDelete: () => void;
  editFormType: (formType: FormTypes)=>void;
  showForm: (showForm: boolean)=>void
}

export const NodeDetails = memo(
  function NodeDetails({nodeList, node, className, ...props }: NodeDetailsProps) {
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
    const deleteNodeHandler = useCallback(() => props.onDelete(), [props]);
    const editUserHandler = useCallback(() => props.editFormType(FormTypes.EDIT), [props]);
    const addChildHandler = useCallback(()=> props.editFormType(FormTypes.ADD_CHILD), [props]);
    const addParentHandler = useCallback(()=> props.editFormType(FormTypes.ADD_PARENT), [props]);
    const addSpouseHandler = useCallback(()=> props.editFormType(FormTypes.ADD_SPOUSE), [props]);

    async function editUserCallback() {
      props.showForm(true)
      editUserHandler()
    }

    async function addChildCallback() {
      props.showForm(true)
      addChildHandler()
    }

    async function addSposeCallback() {
      props.showForm(true)
      addSpouseHandler()
    }

    async function addParentCallback() {
      props.showForm(true)
      addParentHandler()
    }

    async function deleteUserCallback() {
      deleteUser(node, deleteNodeHandler)
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
        <button className={css.reset} onClick={addChildCallback}>
          Добавить ребенка
        </button>
        <button className={css.reset} onClick={addParentCallback}>
          Добавить родителя
        </button>
        <button className={css.reset} onClick={addSposeCallback}>
          Добавить супруга/супругу
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
