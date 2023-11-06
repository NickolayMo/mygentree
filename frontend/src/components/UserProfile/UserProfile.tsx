import React from "react";

export type UserInfo = {
    id: bigint,
    name: string,
    userName:string,
    email:string
}
interface UserProfileProps {
    handleLogout: ()=>void,
    currentUser: UserInfo|undefined,
    isAuthenticated: boolean
}
export const UserProfile:React.FC<UserProfileProps> = (props) => {
    return (
        <div>
            <div>{props.currentUser && props.currentUser.userName}</div>
        </div>
    );
}