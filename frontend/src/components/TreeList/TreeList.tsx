import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Card, List, notification} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {deleteTree, getTreeList} from "../../services/treeService";
import "./TreeList.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";
import {Tip} from "../Tip/Tip";

type TreeInfo = {
    id: bigint,
    name: string
}

enum TreeLinkType {
    NODE,
    ADD
}

interface TreeLinkProps {
    type: TreeLinkType,
    treeInfo?: TreeInfo | undefined
    onDeleteTree?: (id: string) => void
}

const TreeLink: React.FC<TreeLinkProps> = (props) => {
    const [isHovered, setIsHovered] = useState(false)
    if (props.type === TreeLinkType.ADD) {
        return (
            <Tip text={"Добавить дерево"}>
                <Link to={"/tree/add"}>
                    <Card className={"add-new-tree-card"}>
                        <PlusOutlined rev={undefined}/>
                    </Card>
                </Link>
            </Tip>
        )
    }
    if (props.treeInfo) {
        return (
            <div>
                <Link to={"/tree/" + props.treeInfo.id}>
                    <Card className={"tree-card"} onMouseEnter={() => {
                        setIsHovered(true)
                    }} onMouseLeave={() => {
                        setIsHovered(false)
                    }}>
                        {isHovered && (
                            <Tip text={"Удалить дерево"}>
                                <button className={"tree-delete"} onClick={(event) => {
                                    event.preventDefault()
                                    if (props.treeInfo?.id !== undefined && props.onDeleteTree !== undefined) {
                                        props.onDeleteTree(props.treeInfo?.id.toString())
                                    }
                                }}>
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </button>
                            </Tip>
                        )}
                        {props.treeInfo.name}
                    </Card>
                </Link>
            </div>
        )
    }
    return (<div></div>)
}


const TreeList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [treeList, setTreeList] = useState<Array<TreeInfo>>([])
    const onDeleteTreeHandler = (id: string) => {
        setIsLoading(true)
        deleteTree(id)
            .then(response => {
                if (response.success === true) {
                    setIsLoading(false)
                    setTreeList(response.data)
                }
            })
            .catch(err => {
                notification.error({
                    message: '',
                    description: err,
                });
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        setIsLoading(true)
        getTreeList()
            .then(response => {
                if (response.success === true) {
                    setIsLoading(false)
                    setTreeList(response.data)
                }
            })
            .catch(err => {
                notification.error({
                    message: '',
                    description: err,
                });
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    if (isLoading) {
        return (
            <div>
                <Loader/>
            </div>
        )
    }
    const nodes: Array<TreeLinkProps> = treeList.map((val) => {
        return {
            type: TreeLinkType.NODE,
            treeInfo: val,
            onDeleteTree: onDeleteTreeHandler
        }
    })
    nodes.push({
        type: TreeLinkType.ADD
    })
    return (
        <div>
            <List
                grid={{gutter: 16, column: 4}}
                dataSource={nodes}
                renderItem={(item) => (
                    <List.Item>
                        <TreeLink treeInfo={item.treeInfo} type={item.type} onDeleteTree={item.onDeleteTree}></TreeLink>
                    </List.Item>
                )}
            />
        </div>
    )
}
export default TreeList