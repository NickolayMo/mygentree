import React, {useEffect, useState} from "react";
import {UserProfile} from "../UserProfile/UserProfile";
import {getTreeList} from "../../utils/api";
import {Link} from "react-router-dom";


export const Home: React.FC = () => {
    return (
        <div>
            <UserProfile/>
            <TreeList/>

        </div>
    )
}
type TreeInfo = {
    id: bigint,
    name: string
}

const TreeLink: React.FC<TreeInfo> = (treeInfo: TreeInfo) => {

    return (
        <div>
            <Link to={"/tree/"+treeInfo.id}>{treeInfo.name}</Link>
        </div>
    )
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
            .catch(err =>{
                console.log(err)
            })
            .finally(()=>{
                setIsLoading(false)
            })
    },[])
    if(isLoading) {
        return (
            <div>
                Загрузка ...
            </div>
        )
    }
    const nodes = treeList.map(
        treeInfo=> (
            <TreeLink id={treeInfo.id} name={treeInfo.name}/>
        )
    )
    return (
        <div>
            {nodes}
        </div>
    )
}