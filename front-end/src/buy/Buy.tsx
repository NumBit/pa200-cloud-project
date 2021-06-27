import React, { useState } from 'react';
import { Button, Cascader, Form, Input, message, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";

export default function Buy(){
    const [showLoading, setShowLoading] = useState(false);
    //const [createCourse] = useMutation(CREATE_COURSE);
    //const [createEnrollment] = useMutation(CREATE_ENROLMENT);

    const options = [{label: "Platnosť 10 dní", value:10},{label:"Platnosť 30 dní", value:30},{label:"Platnosť 1 rok", value:365}];

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };

    const onFinish = async (values: any) => {
        setShowLoading(true);
/*
        const article = { title: 'React POST Request Example' };
        const response = await axios.post('https://reqres.in/api/articles', article);
        this.setState({ articleId: response.data.id });*/
        console.log(values);
        setShowLoading(false);
        message.success("E-známka bola zakúpená");
    };
    const onFinishFailed = () => {
        message.error("Skontrolujte ŠPZ");
    };
    return (
        <>
            <h1>Kupiť e-známku</h1>
            <Spin
                spinning={showLoading}
                indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            >
                <Form
                    {...layout}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="ŠPZ"
                        name="spz"
                        rules={[
                            {
                                required: true,
                                message: "Zadajte ŠPZ",
                                whitespace: false,
                            },
                        ]}
                    >
                        <Input placeholder="XY123AB" />
                    </Form.Item>
                    <Form.Item
                        label="Platnosť"
                        name="valid"
                        rules={[
                            {
                                required: true,
                                message: "Vyberte dobu platnosti",
                            },
                        ]}
                    >
                        <Cascader size="middle" options={options} />
                    </Form.Item>
                    <Form.Item label="Kúpiť">
                        <Button htmlType="submit" type="primary">
                            Odoslať
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
}