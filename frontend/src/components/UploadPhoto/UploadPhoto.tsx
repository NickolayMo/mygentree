import React, {useMemo, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Input, Modal, Upload} from 'antd';
import type {RcFile, UploadProps} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import {removePhoto, uploadProps} from "../../services/fileService";
import {PersonPhoto} from "../../renderTree/types";
import {ACCESS_TOKEN} from "../../constants";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface UploadPhotoProps {
    defaultPhoto: PersonPhoto[] | undefined,
    value?: string[],
    onChange?: (value: (string | undefined)[]) => void;
}

export const UploadPhoto: React.FC<UploadPhotoProps> = (uploadPhotoProps: UploadPhotoProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const initialFileList = useMemo(() => {

        if (uploadPhotoProps.defaultPhoto != undefined) {

            return uploadPhotoProps.defaultPhoto
                .filter(value => (value != undefined))
                .map((v, i) => {
                    const uploadFile: UploadFile = {
                        fileName: v.filename,
                        uid: v.filename,
                        name: v.filename,
                        status: 'done',
                        url: v.url
                    }
                    return uploadFile
                })

        }

        return []
    }, [uploadPhotoProps.defaultPhoto])
    console.log(initialFileList)
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));

    };
    const handleRemove = async (file: UploadFile) =>{
        return removePhoto(file)
    }

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined rev={undefined}/>
            <div style={{marginTop: 8}}>Загрузить фото</div>
        </button>
    );

    const props: UploadProps = {
        ...uploadProps,
        listType: "picture-card",
        multiple: true,
        defaultFileList: initialFileList,
        onPreview: handlePreview,
        onRemove: handleRemove,
        onChange: ({fileList: newFileList}) => {
            newFileList.forEach((v, i) => {
                if (v.response != undefined) {
                    v.fileName = v.response.data.filename
                    v.url = v.response.data.url
                }
            })
            setFileList(newFileList)
            console.log("console.log(newFileList)")
            console.log(newFileList)
            uploadPhotoProps.onChange?.(newFileList.flatMap(value => value.fileName))
        },

        beforeUpload: (file) => {
            const isAllowed = [
                'image/png',
                'image/webp',
                'image/jpeg'
            ].indexOf(file.type) > 0
            return isAllowed || Upload.LIST_IGNORE;
        },
    }
    return (
        <>
            <Upload {...props}>
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
};