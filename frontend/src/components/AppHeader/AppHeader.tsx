import {Header} from "antd/es/layout/layout"
import Menu from "antd/es/menu/menu"
import {Link} from "react-router-dom"
import './AppHeader.css';
import React from "react";
import {Col, MenuProps, Row} from "antd";
import {MenuInfo} from "rc-menu/lib/interface";
import {SettingOutlined} from "@ant-design/icons";
import {UserInfo} from "../Home/Home";
import {TreeImage} from "../TreeImage/TreeImage";

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
            },
            {
                key: "logout",
                label: "Выйти"
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
                    <Link to="/" className="app-logo">
                        <Row>
                            <Col>
                                <TreeImage width={"50px"} height={"50px"}/>
                            </Col>
                            <Col>
                                Древо
                            </Col>
                        </Row>

                    </Link>
                </div>
                <Menu
                    className="app-menu"
                    mode="horizontal"
                    style={{lineHeight: '64px', width: '20%'}}
                    items={items}
                    onClick={handleMenuClick}
                >
                </Menu>
            </div>
        </Header>
    );
}