import React, {useState} from "react";
import {Button, DatePicker, DatePickerProps, Form, Input, Modal, notification, Select} from "antd";
import {Gender, Node} from "../../renderTree/types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
const dateFormat = "DD.MM.YYYY"
interface ModalFormProps {
    node: Readonly<Node> | undefined,
    nodeId: string | undefined,
    treeId: string
    title: string,
    submitHandler: (values: any) => Promise<any>
    onSuccessHandler: (value: any) => void
    showModalButtonIcon?: React.ReactNode | null;
    showModalButtonTitle?: string;
    show?: boolean | undefined
    notAllowToClose?: boolean | undefined
}

interface State {
    firstName: string | undefined,
    middleName: string | undefined,
    lastName: string | undefined,
    avatar: string | undefined,
    birthDate: string | undefined,
    location: string | undefined,
    occupation: string | undefined,
    gender: string | undefined,
    nodeId: string | undefined,
    treeId: string | undefined,
}

export const ModalForm: React.FC<ModalFormProps> = (props) => {



    const [state, setState] = useState<State>({
        firstName: props.node?.infoNode?.firstName,
        middleName: props.node?.infoNode?.middleName,
        lastName: props.node?.infoNode?.lastName,
        avatar: props.node?.infoNode?.avatar,
        birthDate: props.node?.infoNode?.birthDate,
        location: props.node?.infoNode?.location,
        occupation: props.node?.infoNode?.occupation,
        gender: Gender.male,
        nodeId: props.nodeId,
        treeId: props.treeId
    });
    console.log(dayjs(state.birthDate, dateFormat))
    const customFormat: DatePickerProps['format'] = (value) =>{
        return "";
    }


    const [isModalOpen, setIsModalOpen] = useState(props.show);
    const [loading, setLoading] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        if (props.notAllowToClose) {
            notification.error({
                message: '',
                description: 'Заполните пожалуйста данные'
            });
        } else {
            setIsModalOpen(false);
        }

    };
    const onFinish = (values: any) => {
        setLoading(true)
        props.submitHandler(values)
            .then(response => {
                notification.success({
                    message: '',
                    description: "Изменения успешно сохранены",
                });
                props.onSuccessHandler(response)
            })
            .catch(error => {
                notification.error({
                    message: '',
                    description: error.message || 'Извините! Что-то пошло не так, попробуйте снова!'
                });
            });
        setLoading(false)
        setIsModalOpen(false)
    }

    return (
        <>
            <button onClick={showModal} title={props.showModalButtonTitle}>
                {props.showModalButtonIcon}
            </button>
            <Modal title={props.title} open={isModalOpen} onCancel={handleCancel}
                   footer={[]
                   }
            >
                <Form onFinish={onFinish} initialValues={
                    state
                }>
                    <Form.Item name="avatar">
                        <Input
                            name="avatar"
                            autoComplete="off"
                            placeholder="фото"
                            value={state.avatar}
                        />
                    </Form.Item>
                    <Form.Item name="gender">
                        <Select
                            value={state.gender}
                            options={[
                                {value: Gender.male, label: "Мужской"},
                                {value: Gender.female, label: "Женский"},
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="firstName">
                        <Input
                            name="firstName"
                            autoComplete="off"
                            placeholder="Имя"
                            value={state.firstName}
                        />
                    </Form.Item>
                    <Form.Item name="middleName">
                        <Input
                            name="firstName"
                            autoComplete="off"
                            placeholder="Отчество"
                            value={state.middleName}
                        />
                    </Form.Item>
                    <Form.Item name="lastName">
                        <Input
                            name="lastName"
                            autoComplete="off"
                            placeholder="Фамилия"
                            value={state.lastName}
                        />
                    </Form.Item>
                    <Form.Item name="birthDate">
                        <DatePicker
                            name="firstName"
                            autoComplete="off"
                            placeholder="Дата рождения"
                            value={dayjs(state.birthDate, dateFormat)}
                            format={customFormat}
                        />
                    </Form.Item>
                    <Form.Item name="nodeId" hidden={true}>
                        <Input
                            name="nodeId"
                            value={state.nodeId}
                        />
                    </Form.Item>
                    <Form.Item name="treeId" hidden={true}>
                        <Input
                            name="treeId"
                            value={state.treeId}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                loading={loading}
                        >
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}