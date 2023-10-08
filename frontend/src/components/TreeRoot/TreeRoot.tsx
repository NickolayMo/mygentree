import React, { useMemo, useState, useCallback } from 'react';
import type { Node, ExtNode } from '../../renderTree/types';
import ReactFamilyTree from '../FamilyTree/FamilyTree';
import { SourceSelect } from '../SourceSelect/SourceSelect';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NodeDetails } from '../NodeDetails/NodeDetails';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE } from '../const';
import { getInitData, getNodeStyle, getMockInitData } from '../../utils/utils';



import css from './TreeRoot.module.css';
import { FormTypes, PersonForm } from '../PersonForm/PersonForm';

const resource = getInitData()
export const TreeRoot = () => {
  const data = resource.read()
  //const data = getMockInitData()
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [nodes, setNodes] = useState<readonly Readonly<Node>[]>(data.relatives);
  const [formType, setFormType] = useState<FormTypes>()
  const [formVisible, setFormVisilble] = useState(false)

  const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
  const [rootId, setRootId] = useState(firstNodeId);

  const [selectId, setSelectId] = useState<string>();
  const [hoverId, setHoverId] = useState<string>();

  const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

  const changeSourceHandler = useCallback(
    (value: string, nodes: readonly Readonly<Node>[]) => {
      setRootId(nodes[0].id);
      setNodes(nodes);
      setSource(value);
      setSelectId(undefined);
      setHoverId(undefined);
    },
    [],
  );

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
    [],)

  console.log(formType)

  return (
    <div className={css.root}>
      <header className={css.header}>
        <h1 className={css.title}>
          Мое древо
        </h1>

        <div>
          <label>Source: </label>
          <SourceSelect value={source} items={SOURCES} onChange={changeSourceHandler} />
        </div>
      </header>
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
          onDelete={() => setSelectId(undefined)}
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

