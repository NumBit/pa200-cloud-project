import React, { useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, message, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import axios from 'axios';

export default function Buy() {
    const [showLoading, setShowLoading] = useState(false);
    //const [createCourse] = useMutation(CREATE_COURSE);
    //const [createEnrollment] = useMutation(CREATE_ENROLMENT);
    const url = process.env.REACT_APP_CONNECTION_URL;
    const options = [{ label: "Platnosť 10 dní", value: 10 }, { label: "Platnosť 30 dní", value: 30 }, { label: "Platnosť 1 rok", value: 365 }];

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 },
    };

    const onFinish = async (values: any) => {
        setShowLoading(true);
        const vignette = {
            PartitionKey: values.spz,
            ValidFrom: values.date,
            ValidDays: values.valid[0]
        };

        await axios.put(url + "vignette", vignette, { responseType: "json" })
            .then(res => {
                console.log(res);
                console.log(res.data);
                message.success("E-známka bola zakúpená");
            }).catch(() => message.error("Skontrolujte ŠPZ")).finally(() => setShowLoading(false));
        /*
        
                const article = { title: 'React POST Request Example' };
                const response = await axios.post('https://reqres.in/api/articles', article);
                this.setState({ articleId: response.data.id });*/


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
                                message: "Vyber dobu platnosti",
                            },
                        ]}
                    >
                        <Cascader placeholder="Vyber dobu platnosti" options={options} />
                    </Form.Item>
                    <Form.Item
                        label="Platnosť od"
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: "Vyber dátum",
                            },
                        ]}
                    >
                        <DatePicker placeholder="Vyber dátum" />
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