import React, {useState, ChangeEvent, FormEvent} from 'react';
import "./SignUpForm.css"
import {Link} from 'react-router-dom';
import {checkEmailAvailability, checkUsernameAvailability, signUp} from "../../utils/api";
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import {Form, Input, Button, notification} from 'antd';
import {ValidateStatus} from "antd/es/form/FormItem";

const {Item} = Form;

interface State {
    name: string;
    username: string;
    email: string;
    password: string;
    nameValidateStatus: ValidateStatus;
    usernameValidateStatus: ValidateStatus;
    emailValidateStatus: ValidateStatus;
    passwordValidateStatus: ValidateStatus;
    nameErrorMsg: string | null;
    passwordErrorMsg: string | null;
    emailErrorMsg: string | null;
    usernameErrorMsg: string | null;

}

const Signup: React.FC = () => {
    const [state, setState] = useState<State>({
        email: "",
        emailErrorMsg: "",
        emailValidateStatus: "",
        name: "",
        nameErrorMsg: "",
        nameValidateStatus: "",
        password: "",
        passwordErrorMsg: "",
        passwordValidateStatus: "",
        username: "",
        usernameErrorMsg: "",
        usernameValidateStatus: ""
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, validationFun: (value: string) => any) => {
        const {name, value} = event.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            ...validationFun(value)
        }));
        console.log(state)
    };

    const handleSubmit = (event: FormEvent) => {
        const signupRequest = {
            name: state.name,
            email: state.email,
            username: state.username,
            password: state.password
        };

        signUp(signupRequest)
            .then(response => {
                notification.success({
                    message: '',
                    description: "Thank you! You're successfully registered. Please Login to continue!",
                });
            })
            .catch(error => {
                notification.error({
                    message: '',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
    };

    const isFormInvalid = () => {
        return !(
            state.nameValidateStatus === 'success' &&
            state.usernameValidateStatus === 'success' &&
            state.emailValidateStatus === 'success' &&
            state.passwordValidateStatus === 'success'
        );
    };

    const validateName = (name: string) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                nameValidateStatus: 'error',
                nameErrorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            };
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                nameValidateStatus: 'error',
                nameErrorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            };
        } else {
            return {
                nameValidateStatus: 'success',
                nameErrorMsg: null,
            };
        }
    };

    const validateEmail = (email: string) => {
        if (!email) {
            return {
                emailValidateStatus: 'error',
                emailErrorMsg: 'Email may not be empty'
            };
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                emailValidateStatus: 'error',
                emailErrorMsg: 'Email not valid'
            };
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                emailValidateStatus: 'error',
                emailErrorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            };
        }

        return {
            emailValidateStatus: 'success',
            emailErrorMsg: null,
        };
    };

    const validateUsername = (username: string) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                usernameValidateStatus: 'error',
                usernameErrorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            };
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                usernameValidateStatus: 'error',
                usernameErrorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            };
        } else {
            return {
                usernameValidateStatus: 'success',
                usernameErrorMsg: null,
            };
        }
    };

    const validateUsernameAvailability = () => {
        // First check for client-side errors in username
        const usernameValue = state.username;
        const usernameValidation = validateUsername(usernameValue);

        if (usernameValidation.usernameValidateStatus === 'error') {
            setState((prev) => ({
                ...prev,
                usernameValidation
            }));
            return;
        }

        setState((prev) => ({
            ...prev,

            usernameValidateStatus: 'validating',
            usernameErrorMsg: null

        }));

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if (response.data === true) {
                    setState((prev) => ({
                        ...prev,

                        usernameValidateStatus: 'success',
                        usernameErrorMsg: null

                    }));
                } else {
                    setState((prev) => ({
                        ...prev,

                        usernameValidateStatus: 'error',
                        usernameErrorMsg: 'This username is already taken'
                    }));
                }
            })
            .catch(error => {
                // Marking validateStatus as success, Form will be rechecked at the server
                setState((prev) => ({
                    ...prev,

                    usernameValidateStatus: 'success',
                    usernameErrorMsg: null

                }));
            });
    };

    const validateEmailAvailability = () => {
        // First check for client-side errors in email
        const emailValue = state.email;
        const emailValidation = validateEmail(emailValue);

        if (emailValidation.emailValidateStatus === 'error') {
            setState((prev) => ({
                ...prev,
                emailValidation
            }));
            return;
        }
        setState((prev) => ({
            ...prev,
            emailValidateStatus: 'validating',
            emailErrorMsg: null
        }));

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.data === true) {
                    setState((prev) => ({
                        ...prev,
                        emailValidateStatus: 'success',
                        emailErrorMsg: null
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        emailValidateStatus: 'error',
                        emailErrorMsg: 'This Email is already registered'
                    }));
                    console.log(state)
                }
            })
            .catch(error => {
                setState((prev) => ({
                    ...prev,
                    emailValidateStatus: 'success',
                    emailErrorMsg: null
                }));
            });
    };

    const validatePassword = (password: string) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                passwordValidateStatus: 'error',
                passwordErrorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            };
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                passwordValidateStatus: 'error',
                passwordErrorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            };
        } else {
            return {
                passwordValidateStatus: 'success',
                passwordErrorMsg: null,
            };
        }
    };

    return (
        <div className="signup-container">
            <h1 className="page-title">Sign Up</h1>
            <div className="signup-content">
                <Form onFinish={handleSubmit} className="signup-form">
                    <Item
                        label="Full Name"
                        validateStatus={state.nameValidateStatus}
                        help={state.nameErrorMsg}
                    >
                        <Input
                            size="large"
                            name="name"
                            autoComplete="off"
                            placeholder="Your full name"
                            value={state.name}
                            onChange={(event) => handleInputChange(event, validateName)}
                        />
                    </Item>
                    <Item
                        label="Username"
                        hasFeedback
                        validateStatus={state.usernameValidateStatus}
                        help={state.usernameErrorMsg}
                    >
                        <Input
                            size="large"
                            name="username"
                            autoComplete="off"
                            placeholder="A unique username"
                            value={state.username}
                            onBlur={validateUsernameAvailability}
                            onChange={(event) => handleInputChange(event, validateUsername)}
                        />
                    </Item>
                    <Item
                        label="Email"
                        hasFeedback
                        validateStatus={state.emailValidateStatus}
                        help={state.emailErrorMsg}
                    >
                        <Input
                            size="large"
                            name="email"
                            type="email"
                            autoComplete="off"
                            placeholder="Your email"
                            value={state.email}
                            onBlur={validateEmailAvailability}
                            onChange={(event) => handleInputChange(event, validateEmail)}
                        />
                    </Item>
                    <Item
                        label="Password"
                        validateStatus={state.passwordValidateStatus}
                        help={state.passwordErrorMsg}
                    >
                        <Input
                            size="large"
                            name="password"
                            type="password"
                            autoComplete="off"
                            placeholder="A password between 6 to 20 characters"
                            value={state.password}
                            onChange={(event) => handleInputChange(event, validatePassword)}
                        />
                    </Item>
                    <Item>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={isFormInvalid()}>Sign up</Button>
                        Already registered? <Link to="/login">Login now!</Link>
                    </Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
