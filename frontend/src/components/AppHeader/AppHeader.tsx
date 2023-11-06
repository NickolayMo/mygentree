import {Header} from "antd/es/layout/layout"
import Menu from "antd/es/menu/menu"
import {Link} from "react-router-dom"
import './AppHeader.css';
import {UserInfo} from "../UserProfile/UserProfile";
import React from "react";
import {MenuProps} from "antd";
import {MenuInfo} from "rc-menu/lib/interface";
import {SettingOutlined} from "@ant-design/icons";

interface AppHeaderProps {
    currentUser: UserInfo | undefined,
    isAuthenticated: boolean,
    handleLogout: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = (props: AppHeaderProps) => {

    const items: MenuProps['items'] = props.currentUser && props.isAuthenticated ?
        [
            {
                key: "profile",
                label: props.currentUser?.userName,
                icon: <SettingOutlined rev={undefined} />,
                children:[
                    {
                        key: "logout",
                        label: "Выйти"
                    }
                ]
            }
        ]
        :
        [
            {
                key: "signIn",
                label: (
                    <Link to="/sign_in">Войти</Link>
                )
            },
            {
                key: "signUp",
                label: (
                    <Link to="/sign_up">Регистрация</Link>
                )
            }
        ]

    const handleMenuClick = (key: MenuInfo) => {
        if (key.key === "logout") {
            props.handleLogout()
        }
    }

    return (
        <Header className="app-header">
            <div className="container">
                <div className="app-title">
                    <Link to="/">Древо</Link>
                </div>
                <Menu
                    className="app-menu"
                    mode="horizontal"
                    style={{lineHeight: '64px'}}
                    items={items}
                    onClick={handleMenuClick}
                >
                </Menu>
            </div>
        </Header>
    );
}