import React, {ChangeEvent, useState} from "react";
import {Button, Form, Input, List, notification} from "antd";
import {ValidateStatus} from "antd/es/form/FormItem";
import {NAME_MAX_LENGTH, NAME_MIN_LENGTH} from "../../constants";
import "./TreeCreateForm.css"
import {useNavigate} from "react-router-dom";
import {createTree} from "../../services/treeService";

const {Item} = Form;

interface State {
    name: string;
    nameValidateStatus: ValidateStatus;
    nameErrorMsg: string | null;

}

export const TreeCreateForm: React.FC = () => {
    const navigate = useNavigate()
    const [state, setState] = useState<State>(
        {
            name: "",
            nameValidateStatus: "",
            nameErrorMsg: ""
        }
    )
    const handleSubmit = () => {
        createTree(state.name)
            .then(response => {
                if(response.success === true) {
                    notification.success({
                        message: '',
                        description: "Дерево успешно создано",
                    });
                    navigate("/tree/"+response.data.treeId)
                } else {
                    notification.error({
                        message: '',
                        description: response.data.error,
                    });
                }

            })
            .catch(error => {
                notification.error({
                    message: '',
                    description: error.message || 'Извините! Что-то пошло не так, попробуйте снова!'
                });
            });
    }
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>, validationFun: (value: string) => any) => {
        const {name, value} = event.target;
        setState((prev) => ({
            ...prev,
            [name]: value,
            ...validationFun(value)
        }));
    };

    const validateName = (name: string) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                nameValidateStatus: 'error',
                nameErrorMsg: `Имя слишком короткое (Минимум ${NAME_MIN_LENGTH} символов нужно.)`
            };
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                nameValidateStatus: 'error',
                nameErrorMsg: `Имя слишком длинное (Максимум ${NAME_MAX_LENGTH} символов можно.)`
            };
        } else {
            return {
                nameValidateStatus: 'success',
                nameErrorMsg: null,
            };
        }
    };

    return (
        <div className="create-tree-container">
            <h1>
                Добавление нового дерева
            </h1>
            <div className="create-tree-content">
                <Form
                    onFinish={handleSubmit}
                >
                    <Item
                        validateStatus={state.nameValidateStatus}
                        help={state.nameErrorMsg}
                    >
                        <Input
                            name="name"
                            autoComplete="off"
                            placeholder="Придумайте имя дерева"
                            value={state.name}
                            onChange={(event) => handleInputChange(event, validateName)}
                        />
                    </Item>
                    <Item>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button">Добавить дерево</Button>
                    </Item>
                </Form>
            </div>

        </div>
    )
}