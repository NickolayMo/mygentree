import React from 'react';
import './SignInForm.css';
import {Button, Form, Input} from 'antd';
import {ACCESS_TOKEN} from '../../constants';
import {Link} from "react-router-dom";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {signIn} from "../../services/userService";


interface SignInForm {
    handleLogin: () => void
}

const SignInForm: React.FC<SignInForm> = (props: SignInForm) => {

    const onFinish = (values: any) => {
        console.log('Success:', values);
        signIn(values).then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.accessToken);
            props.handleLogin()
        }).catch(error => {
            console.log(error)
        });
    };
    return (
        <div className="signin-container">
            <h1 className="page-title">Вход</h1>
            <div className="signin-content">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="usernameOrEmail"
                        rules={[{required: true, message: 'Пожалуйста введите свой логин или Email'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" rev={undefined}/>}
                               placeholder="Логин"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '\'Пожалуйста введите свой пароль'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" rev={undefined}/>}
                            type="password"
                            placeholder="Пароль"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="signin-form-button" size="large">
                            Войти
                        </Button>
                        или <Link to="/sign_up"> зарегистрируйтесь!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>

    );
}

export default SignInForm;