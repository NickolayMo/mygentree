import React, {useEffect, useState} from "react";
import {UserInfo, UserProfile} from "../UserProfile/UserProfile";
import {getTreeList} from "../../utils/api";
import {Link} from "react-router-dom";
import {Card, List} from "antd";
import "./Home.css"
import {PlusOutlined} from "@ant-design/icons";

interface HomeProps {
    handleLogout: () => void,
    currentUser: UserInfo | undefined,
    isAuthenticated: boolean
}

export const Home: React.FC<HomeProps> = (props) => {
    return (
        <div>
            {props.isAuthenticated && props.currentUser && (
                <div className="home-container">
                    {/*<UserProfile currentUser={props.currentUser} handleLogout={props.handleLogout}*/}
                    {/*             isAuthenticated={props.isAuthenticated}/>*/}
                    <h1>Мои деревья</h1>
                    <TreeList/>
                </div>
            )}
        </div>
    )
}
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
    treeInfo?: TreeInfo|undefined
}
const TreeLink: React.FC<TreeLinkProps> = (props) => {
    if(props.type === TreeLinkType.ADD) {
        return (
            <Link to={"/tree/add"}>
                <Card>
                   <PlusOutlined rev={undefined}/>
                    Добавить новое дерево
                </Card>
            </Link>
        )
    }
    if(props.treeInfo){
        return(
            <Link to={"/tree/" + props.treeInfo.id}>
                <Card>
                    {props.treeInfo.name}
                </Card>
            </Link>
        )
    }
    return (<div></div>)
}


const TreeList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [treeList, setTreeList] = useState<Array<TreeInfo>>([])
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
    const nodes:Array<TreeLinkProps> = treeList.map((val) => {
        return {
            type: TreeLinkType.NODE,
            treeInfo: val
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
                        <TreeLink treeInfo={item.treeInfo} type={item.type}></TreeLink>
                    </List.Item>
                )}
            />
        </div>
    )
}