import React, {useMemo, useState, useCallback, useEffect} from 'react';
import type {Node, ExtNode} from '../../renderTree/types';
import ReactFamilyTree from '../FamilyTree/FamilyTree';
import {PinchZoomPan} from '../PinchZoomPan/PinchZoomPan';
import {FamilyNode} from '../FamilyNode/FamilyNode';
import {NodeDetails} from '../NodeDetails/NodeDetails';
import {NODE_WIDTH, NODE_HEIGHT} from '../const';
import {getNodeStyle} from '../../utils/utils';

import css from './TreeRoot.module.css';
import {FormTypes, PersonForm} from '../PersonForm/PersonForm';
import {getTreeNodes} from "../../utils/api";
import {useParams} from "react-router-dom";

export const TreeRoot: React.FC = () => {
    let {id} = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [treeNodes, setTreeNodes] = useState<Readonly<Node>[]>([])

    useEffect(() => {
        if (!id) {
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
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    if (isLoading) {
        return (
            <div>
                Загрузка ...
            </div>
        )
    }
    if (treeNodes.length === 0) {
        return <></>
    }
    return (
        <Tree treeNodes={treeNodes}/>
    )
}

type TreeProps = {
    treeNodes: readonly Readonly<Node>[]
}
export const Tree: React.FC<TreeProps> = (treeNodes: TreeProps) => {
    console.log(treeNodes)
    const [nodes, setNodes] = useState<readonly Readonly<Node>[]>(treeNodes.treeNodes);
    const [formType, setFormType] = useState<FormTypes>()
    const [formVisible, setFormVisilble] = useState(false)

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
                    editFormType={setFormType}
                    showForm={setFormVisilble}
                />
            )}
            {selected && formVisible && (
                <PersonForm
                    formType={formType}
                    className={css.personForm}
                    node={selected}
                    nodeList={nodes}
                    onPersonChange={onPersonChange}
                    onClose={setFormVisilble}
                />
            )}
        </div>
    );
}

