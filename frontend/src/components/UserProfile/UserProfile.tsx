import {useEffect, useState} from "react";
import {getCurrentUser, getTreeList} from "../../utils/api";

type UserInfo = {
    id: bigint,
    name: string,
    userName:string,
    email:string
}
export const UserProfile = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserInfo>()
    useEffect(() => {
        setIsLoading(true)
        getCurrentUser()
            .then(response => {
                if (response.success === true) {
                    setIsLoading(false)
                    setUserInfo(response.data)
                }
            })
            .catch(err =>{
                console.log(err)
            })
            .finally(()=>{
                setIsLoading(false)
            })
    }, []);
    if(isLoading) {
        return (
            <div>
                Загрузка...
            </div>
        )
    }
    return (
        <div>
            <div>{userInfo && userInfo.userName}</div>
        </div>
    );
}