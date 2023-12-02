import React, {ReactNode, useMemo, useState} from "react";
import {Tooltip, TooltipProps} from "antd";
import classNames from "classnames";
import css from "../FamilyNode/FamilyNode.module.css";
import {BranchesOutlined} from "@ant-design/icons";
import {prop} from "../../renderTree/utils";

interface TipProps {
    text?: string
    children: React.ReactNode;
}

export const Tip: React.FC<TipProps> = (props) => {
    const [arrow, setArrow] = useState('Show');
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);
    return (
        <Tooltip placement="topLeft" title={props.text} arrow={mergedArrow}>
            {props.children}
        </Tooltip>
    )
}
