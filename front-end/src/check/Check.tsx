import React, { useState } from 'react';
import { Button, Cascader, Descriptions, Form, Input, message, Spin, Tag } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";

export default function Check() {
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setshowResult] = useState(false);

    const formatDate = (date: string) => {
        const newDate = new Date(date);
        let options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };

        return newDate.toLocaleDateString("en-US", options);
    };

    const options = [{ label: "Platnosť 10 dní", value: 10 }, { label: "Platnosť 30 dní", value: 30 }, { label: "Platnosť 1 rok", value: 365 }];

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
        setshowResult(true);
    };
    const onFinishFailed = () => {
        message.error("Stav nezistený");
    };

    if (showResult) {
        return (<div>
            <h1>Záznam</h1>
            <Descriptions
                bordered
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label="ŠPZ">{"XY123AB"}</Descriptions.Item>
                <Descriptions.Item label="Platná">
                    <Tag
                        color={
                            true
                                ? "green"
                                : "volcano"
                        }
                    >
                        {true ? "Platná" : "Neplatná"}
                    </Tag></Descriptions.Item>
                <Descriptions.Item label="Platnosť od">{"formatDate()"}</Descriptions.Item>
                <Descriptions.Item label="Platnosť do">{"formatDate()"}</Descriptions.Item>
            </Descriptions>
        </div>



        );
    }

    return (
        <>
            <h1>Overiť e-známku</h1>
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
                    <Form.Item label="Overiť">
                        <Button htmlType="submit" type="primary">
                            Odoslať
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
}