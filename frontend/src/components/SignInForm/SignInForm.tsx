import React from 'react';
import './SignInForm.css';
import { Button, Form, Input } from 'antd';
import { SignInRequest } from './SignInRequest';
import { signIn } from '../../utils/api';
import { ACCESS_TOKEN } from '../../constants';

const onFinish = (values: any) => {
    console.log('Success:', values);
    signIn(values).then(response=>{
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
    }).catch(error=>{
        console.log(error)
    });
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const SignInForm: React.FC = () => (
    <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item<SignInRequest>
            label="Логин/email"
            name="usernameOrEmail"
            rules={[{ required: true, message: 'Пожалуйста введите свой логин!' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<SignInRequest>
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Пожалуйста введите свой пароль!' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
);

export default SignInForm;