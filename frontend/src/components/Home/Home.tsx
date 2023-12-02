import React from "react";
import "./Home.css"
import TreeList from "../TreeList/TreeList";

export type UserInfo = {
    id: bigint,
    name: string,
    userName: string,
    email: string
}

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
                    <h1>Мои деревья</h1>
                    <TreeList/>
                </div>
            )}
        </div>
    )
}
