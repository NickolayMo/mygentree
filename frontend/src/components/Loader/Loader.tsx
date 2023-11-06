import React from "react";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

export const Loader: React.FC = () => {
    const antIcon = <LoadingOutlined rev={undefined} />;
    return (
        <Spin indicator={antIcon} style = {{display: 'block', textAlign: 'center', marginTop: 30}} />
    )
}