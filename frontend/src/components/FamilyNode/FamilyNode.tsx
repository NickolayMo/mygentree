import React, {useCallback, useMemo, useState} from 'react';
import classNames from 'classnames';
import type {ExtNode} from '../../renderTree/types';
import css from './FamilyNode.module.css';
import {getPersonName} from '../../utils/utils'
import {BranchesOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {Tip} from "../Tip/Tip";

interface FamilyNodeProps {
    node: ExtNode;
    isRoot: boolean;
    isHover?: boolean;
    onClick: (id: string) => void;
    onSubClick: (id: string) => void;
    style?: React.CSSProperties;
}

export const FamilyNode = React.memo(
    function FamilyNode({node, isRoot, isHover, onClick, onSubClick, style}: FamilyNodeProps) {
        const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
        const clickSubHandler = useCallback(() => onSubClick(node.id), [node.id, onSubClick]);


        return (
            <div className={css.root} style={style}>
                <div className={css.hasSubTree}>
                    {node.hasSubTree && (
                        <Tip text={"Oткрыть поддерево"}>
                            <button
                                className={classNames(css.sub, css[node.gender.toLocaleLowerCase()])}
                                onClick={(event) => {
                                    event.preventDefault()
                                    clickSubHandler()
                                }}
                            >
                                <BranchesOutlined rev={""}/>
                            </button>
                        </Tip>
                    )}
                </div>
                <div
                    className={classNames(
                        css.inner,
                        css[node.gender.toLowerCase()],
                        isRoot && css.isRoot,
                        isHover && css.isHover,
                    )}
                    onClick={clickHandler}
                >
                    {/*header*/}
                    <div className={css.header}>
                        <div className={css.headerTitle}>{!isRoot && node.kinship}</div>
                    </div>
                    {/*body*/}
                    <div className={css.body}>
                        {node.infoNode && node.infoNode.avatar && (
                            <div className={css.avatar}>
                                <img className={css.avatarImg} src={node.infoNode.avatar} alt='avatar'></img>
                            </div>
                        )}
                        <div className={css.personInfo}>
                            <div className={css.personName}>{getPersonName(node)}</div>
                            <div className={css.personBirhDate}>{node.infoNode?.birthDate ?? ""}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);
