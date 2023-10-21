import { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import type { Node } from '../../renderTree/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { getPersonName } from '../../utils/utils';
import { deleteUser } from './actions';
import { FormTypes } from '../PersonForm/PersonForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faChild, faEdit, faL, faPerson, faRing, faTrashCan, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

interface NodeDetailsProps {
  node: Readonly<Node>;
  nodeList: ReadonlyArray<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
  onDelete: (nodes: readonly Readonly<Node>[]) => void;
  editFormType: (formType: FormTypes) => void;
  showForm: (showForm: boolean) => void
}

export const NodeDetails = memo(
  function NodeDetails({ nodeList, node, className, onDelete, ...props }: NodeDetailsProps) {
    const [showAddPersonRel, setShowAddPersonRel] = useState(false)
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
    const editUserHandler = useCallback(() => props.editFormType(FormTypes.EDIT), [props]);
    const addChildHandler = useCallback(() => props.editFormType(FormTypes.ADD_CHILD), [props]);
    const addParentHandler = useCallback(() => props.editFormType(FormTypes.ADD_PARENT), [props]);
    const addSpouseHandler = useCallback(() => props.editFormType(FormTypes.ADD_SPOUSE), [props]);
    const handleShowAddPersonRel = () => {
      setShowAddPersonRel(!showAddPersonRel)
    }



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
      deleteUser(node, onDelete)
    }


    return (
      <section className={classNames(css.root, className)}>
        <div hidden>{node.id}</div>

        <header className={css.header}>
          <button className={css.close} onClick={closeHandler}>&#10005;</button>
          {node.infoNode && node.infoNode.avatar && (
            <div className={css.avatar}>
              <img className={css.avatarImg} src={node.infoNode.avatar} alt='avatar'></img>
            </div>
          )}
          <div className={css.name}>
            <h3 className={css.title}>{getPersonName(node)}</h3>
          </div>
        </header>
        <section className={css.editBlock}>
          <button className={css.delete} onClick={deleteUserCallback}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
          <button className={css.editButton} onClick={editUserCallback}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className={classNames(css.add, showAddPersonRel ? css.on : css.off)} onClick={handleShowAddPersonRel}>
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
          {showAddPersonRel && (
            <section className={css.edit}>
              <button className={css.reset} onClick={addChildCallback} title='Добавить ребенка'>
                  <FontAwesomeIcon icon={faBaby} /> 
              </button>
              <button className={css.reset} onClick={addParentCallback} title='Добавить родителя'>
                  <FontAwesomeIcon icon={faPerson} />
              </button>
              <button className={css.reset} onClick={addSposeCallback} title='Добавить супруга/супругу'>
                <FontAwesomeIcon icon={faRing} /> 
              </button>
            </section>
          )}
          {/* <ReactModal isOpen={showAddPersonModal} className={css.addPersonModal}>
            <button className={css.close} onClick={handleCloseShowAddPersonModal}>&#10005;</button>
          </ReactModal> */}
        </section>
        <Relations {...props} title="Родители" items={node.parents} nodeList={nodeList} />
        <Relations {...props} title="Дети" items={node.children} nodeList={nodeList} />
        <Relations {...props} title="Братья и сестры" items={node.siblings} nodeList={nodeList} />
        <Relations {...props} title="Супруги" items={node.spouses} nodeList={nodeList} />
      </section>
    );
  },
);
