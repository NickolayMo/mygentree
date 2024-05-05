import React from "react";
import "./Home.css"
import {TreeList} from "../TreeList/TreeList";
import {TreeImage} from "../TreeImage/TreeImage";
import {Col, Row, Typography} from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import {Link} from "react-router-dom";

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
    return props.isAuthenticated && props.currentUser ? (
        <TreeList isAuthenticated={props.isAuthenticated}/>
    ) : (
        <div>
            <Row>
                <Col>
                    <TreeImage width={"500px"} height={"500px"}/>
                </Col>
                <Col className="home-info-content">
                    <Typography>
                        <Title>
                            Добро пожаловать в мир вашей истории!
                        </Title>
                        <Paragraph>
                            Вы когда-нибудь задумывались о своих корнях?
                            Откуда вы происходите, кем были ваши предки, какие истории и судьбы скрываются за вашей
                            фамилией?
                            Генеалогическое дерево - это путеводитель в мире вашего происхождения, и мы рады
                            приветствовать вас здесь, чтобы помочь вам раскрыть эту удивительную историю.
                        </Paragraph>
                        <Title level={3}>О нашем проекте:</Title>
                        <Paragraph>
                            Наш сайт представляет собой инструмент для создания и сохранения вашего семейного древа.
                            Здесь вы можете начать свой путь исследования, добавляя свои родственные связи, истории и
                            фотографии, чтобы создать полную картину вашего родословного древа.
                        </Paragraph>
                        <Title level={3}>
                            Начните свое путешествие:
                        </Title>
                        <Paragraph>
                            Загляните в прошлое, чтобы лучше понять себя и своих предков. Наш сайт предоставит вам
                            инструменты для этого удивительного путешествия. Начните прямо сейчас и позвольте вашей
                            семейной истории стать частью великой истории человечества.

                            Готовы начать? <Link to="/sign_in">Зарегистрируйтесь прямо сейчас</Link>, чтобы начать
                            создание своего генеалогического дерева!
                        </Paragraph>
                    </Typography>
                </Col>
            </Row>

        </div>
    )
}
