import React, { useState } from 'react';
import { Button, Descriptions, Form, Input, message, Spin, Table, Tag } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import axios from 'axios';
import dayjs from 'dayjs';

export interface Vignettes {
    entries: Entry[];
    continuationToken: null;
}

export interface Entry {
    PartitionKey: any;
    RowKey: any;
    Timestamp: any;
    ValidDays: ValidDays;
    ValidFrom: any;
}
export interface ValidDays {
    _: number;
}



export default function Check() {
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resData, setResData] = useState<Vignettes>();
    const url = process.env.REACT_APP_CONNECTION_URL;

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 8 }
    };

    const onFinish = async (values: any) => {

        setShowLoading(true);
        await axios.get(url + "check/" + values.spz)
            .then(res => {
                console.log(res);
                console.log(res.data);
            }).catch(() => message.error("Skontrolujte ŠPZ")).finally(() => setShowLoading(false));
        console.log("values");
        await axios.get(url + "vignettes/" + values.spz)
            .then(res => {
                console.log(res);
                console.log(res.data);
                setResData(res.data);
            }).catch(() => message.error("Skontrolujte ŠPZ")).finally(() => setShowLoading(false));
        setShowLoading(false);
        setShowResult(true);
    };
    const onFinishFailed = () => {
        message.error("Stav nezistený");
    };

    if (showResult) {
        if (!resData || resData?.entries.length === 0) {
            return (<h1>Žiaden záznam</h1>)
        }

        const dataSource = resData?.entries.map((e: Entry) => {
            return {
                ecv: e.PartitionKey,
                Key: e.RowKey,
                Bought: e.Timestamp,
                ValidDays: e.ValidDays,
                ValidFrom: e.ValidFrom,
                PartitionKey: e.PartitionKey,
                RowKey: e.RowKey,
                Timestamp: e.Timestamp
            };
        });

        const columns = [
            {
                title: "EČV",
                dataIndex: "ecv",
                key: "ecv",
                render: (e: any) => e._,
            },
            {
                title: "Kupené",
                dataIndex: "Bought",
                key: "Bought",
                render: (e: any) => dayjs(e._).toString(),
            },
            {
                title: "Platné od",
                dataIndex: "ValidFrom",
                key: "ValidFrom",
                render: (e: any) => dayjs(e._).toString(),
            },
            {
                title: "Platné dní",
                dataIndex: "ValidDays",
                key: "ValidDays",
                render: (e: ValidDays) => e._,
            },
            {
                title: "Platnosť",
                dataIndex: "ValidFrom",
                key: "ValidFrom",
                render: (_: any, entry: Entry) => {
                    const validity = dayjs(entry.ValidFrom._).isBefore(dayjs()) && dayjs().isBefore(dayjs(entry.ValidFrom._).add(
                        +entry.ValidDays._,
                        "day"
                    ));
                    return <Tag
                        color={
                            validity
                                ? "green"
                                : "volcano"
                        }
                    >
                        {validity ? "Platná" : "Neplatná"}
                    </Tag>
                }
                ,
            },
        ]

        return (
            <div>
                <h1>Záznam</h1>
                <Table dataSource={dataSource} columns={columns}></Table>
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