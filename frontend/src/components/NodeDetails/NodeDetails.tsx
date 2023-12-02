import {memo, useCallback, useState} from 'react';
import classNames from 'classnames';
import type {Node} from '../../renderTree/types';
import {Relations} from './Relations';
import css from './NodeDetails.module.css';
import {getPersonName} from '../../utils/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faBaby,
    faEdit,
    faPerson,
    faRing,
    faTrashCan,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import ReactModal from 'react-modal';
import {ModalForm} from "../ModalForm/ModalForm";

import {addChild, addParent, addSpouse, deleteUser, updatePerson} from "../../services/personService";
import {Tip} from "../Tip/Tip";

ReactModal.setAppElement('#root');

interface NodeDetailsProps {
    node: Readonly<Node>;
    nodeList: ReadonlyArray<Node>;
    className?: string;
    onSelect: (nodeId: string | undefined) => void;
    onHover: (nodeId: string) => void;
    onClear: () => void;
    onDelete: (nodes: readonly Readonly<Node>[]) => void;
    onPersonChange: (nodes: readonly Readonly<Node>[]) => void;
    treeId: string;
}

export const NodeDetails = memo(
    function NodeDetails({nodeList, node, className, onDelete, onPersonChange, treeId, ...props}: NodeDetailsProps) {
        const [showAddPersonRel, setShowAddPersonRel] = useState(false)
        const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
        const handleShowAddPersonRel = () => {
            setShowAddPersonRel(!showAddPersonRel)
        }

        async function deleteUserCallback() {
            deleteUser(node, treeId, onDelete)
        }

        const formSuccessHandler = (apiResponse: any) => {
            onPersonChange(apiResponse.data.relatives)
        }

        const editHandler = (values: any) => {
            return updatePerson(values, node.id, treeId)
        }
        const addChildHandler = (values: any) => {
            return addChild(values, node, treeId)
        }
        const addParentHandler = (values: any) => {
            return addParent(values, node, treeId)
        }
        const addSpouseHandler = (values: any) => {
            return addSpouse(values, node, treeId)
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
                    <Tip text={"Удалить"}>
                        <button className={css.delete} onClick={deleteUserCallback}>
                            <FontAwesomeIcon icon={faTrashCan}/>
                        </button>
                    </Tip>
                    <ModalForm
                        node={node}
                        nodeId={node.id}
                        treeId={treeId}
                        title={'Редактирование'}
                        submitHandler={editHandler}
                        onSuccessHandler={formSuccessHandler}
                        showModalButtonIcon={<FontAwesomeIcon icon={faEdit}/>}
                        showModalButtonTitle={'Редактирование'}
                    />
                    <button className={classNames(css.add, css.editButton, showAddPersonRel ? css.on : css.off)}
                            onClick={handleShowAddPersonRel}>
                        <FontAwesomeIcon icon={faUserPlus}/>
                    </button>
                    {showAddPersonRel && (
                        <section className={css.edit}>
                            <ModalForm
                                node={undefined}
                                nodeId={node.id}
                                treeId={treeId}
                                title={'Добавить ребенка'}
                                submitHandler={addChildHandler}
                                onSuccessHandler={formSuccessHandler}
                                showModalButtonIcon={<FontAwesomeIcon icon={faBaby}/>}
                                showModalButtonTitle={'Добавить ребенка'}
                            />
                            <ModalForm
                                node={undefined}
                                nodeId={node.id}
                                treeId={treeId}
                                title={'Добавить родителя'}
                                submitHandler={addParentHandler}
                                onSuccessHandler={formSuccessHandler}
                                showModalButtonIcon={<FontAwesomeIcon icon={faPerson}/>}
                                showModalButtonTitle={'Добавить родителя'}
                            />
                            <ModalForm
                                node={undefined}
                                nodeId={node.id}
                                treeId={treeId}
                                title={'Добавить супруга/супругу'}
                                submitHandler={addSpouseHandler}
                                onSuccessHandler={formSuccessHandler}
                                showModalButtonIcon={<FontAwesomeIcon icon={faRing}/>}
                                showModalButtonTitle={'Добавить супруга/супругу'}
                            />
                        </section>
                    )}
                </section>
                <Relations {...props} title="Родители" items={node.parents} nodeList={nodeList}/>
                <Relations {...props} title="Дети" items={node.children} nodeList={nodeList}/>
                <Relations {...props} title="Братья и сестры" items={node.siblings} nodeList={nodeList}/>
                <Relations {...props} title="Супруги" items={node.spouses} nodeList={nodeList}/>
            </section>
        );
    },
);
