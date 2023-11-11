import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {ExtNode, Node} from '../../renderTree/types';
import ReactFamilyTree from '../FamilyTree/FamilyTree';
import {PinchZoomPan} from '../PinchZoomPan/PinchZoomPan';
import {FamilyNode} from '../FamilyNode/FamilyNode';
import {NodeDetails} from '../NodeDetails/NodeDetails';
import {getNodeStyle} from '../../utils/utils';

import css from './TreeRoot.module.css';
import {useParams} from "react-router-dom";
import {notification} from "antd";
import {UserInfo} from "../Home/Home";
import {ModalForm} from "../ModalForm/ModalForm";
import {getTreeNodes} from "../../services/treeService";
import {createFirstPerson} from "../../services/personService";
import {NODE_HEIGHT, NODE_WIDTH} from "../../constants";

interface TreeRootProps {
    handleLogout: () => void,
    currentUser: UserInfo | undefined,
    isAuthenticated: boolean
}

export const TreeRoot: React.FC<TreeRootProps> = (props) => {
    let {id} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [treeNodes, setTreeNodes] = useState<readonly Readonly<Node>[]>([])
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        if (!id || !props.currentUser || !props.isAuthenticated) {
            return
        }
        setIsLoading(true)
        getTreeNodes(id)
            .then(response => {
                if (response.success === true) {
                    setIsLoading(false)
                    setTreeNodes(response.data.relatives)
                }
            })
            .catch(error => {
                setIsError(true)
                notification.error({
                    message: '',
                    description: error.message || 'Извините! Что-то пошло не так, попробуйте снова!'
                });
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    const onPersonChange = useCallback(
        (nodes: readonly Readonly<Node>[]) => {
            setTreeNodes(nodes);
        },
        [])

    if (isLoading) {
        return (
            <div>
                Загрузка ...
            </div>
        )
    }
    const createPersonHandler = (values: any) => {
        if(id){
            return createFirstPerson(values, id)
        }
        return Promise.reject()
    }
    const formSuccessHandler = (apiResponse: any) => {
        onPersonChange(apiResponse.data.relatives)
    }
    if (treeNodes.length === 0 && !isError && id) {
        return (
            <div className={css.root}>
                <ModalForm
                    node={undefined}
                    nodeId={undefined}
                    treeId={id}
                    title={'Заполните информацию о себе'}
                    submitHandler={createPersonHandler}
                    onSuccessHandler={formSuccessHandler}
                    show={true}
                    notAllowToClose={true}
                />
            </div>
        )

    }
    if (treeNodes.length === 0 || !id) {
        return <></>
    }
    return (
        <Tree treeNodes={treeNodes} treeId={id}/>
    )
}

type TreeProps = {
    treeNodes: readonly Readonly<Node>[],
    treeId: string
}
export const Tree: React.FC<TreeProps> = (props: TreeProps) => {
    const [nodes, setNodes] = useState<readonly Readonly<Node>[]>(props.treeNodes);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [selectId, setSelectId] = useState<string>();
    const [hoverId, setHoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const selected = useMemo(() => (
        nodes.find(item => item.id === selectId)
    ), [nodes, selectId]);

    const onPersonChange = useCallback(
        (nodes: readonly Readonly<Node>[]) => {
            setRootId(nodes[0].id);
            setNodes(nodes);
            setSelectId(selectId);
            setHoverId(selectId);
        },
        [])
    const onPersonDelete = useCallback(
        (nodes: readonly Readonly<Node>[]) => {
            setRootId(nodes[0].id);
            setNodes(nodes);
            setSelectId(undefined);
            setHoverId(undefined);
        },
        [])

    return (
        <div className={css.root}>
            {nodes.length > 0 && (
                <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
                    <ReactFamilyTree
                        nodes={nodes}
                        rootId={rootId}
                        width={NODE_WIDTH}
                        height={NODE_HEIGHT}
                        className={css.tree}
                        renderNode={(node: Readonly<ExtNode>) => (
                            <FamilyNode
                                key={node.id}
                                node={node}
                                isRoot={node.id === rootId}
                                isHover={node.id === hoverId}
                                onClick={setSelectId}
                                onSubClick={setRootId}
                                style={getNodeStyle(node)}
                            />
                        )}
                    />
                </PinchZoomPan>
            )}
            {rootId !== firstNodeId && (
                <button className={css.reset} onClick={resetRootHandler}>
                    Reset
                </button>
            )}
            {selected && (
                <NodeDetails
                    node={selected}
                    nodeList={nodes}
                    className={css.details}
                    onSelect={setSelectId}
                    onHover={setHoverId}
                    onClear={() => setHoverId(undefined)}
                    onDelete={onPersonDelete}
                    onPersonChange={onPersonChange}
                    treeId={props.treeId}
                />
            )}
        </div>
    );
}

