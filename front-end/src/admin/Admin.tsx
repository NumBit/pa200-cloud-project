import React, { useEffect, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';



export default function Admin() {
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resData, setResData] = useState<DataQuery>();
    const url = process.env.REACT_APP_CONNECTION_URL;

    useEffect(() => {
        async function fetchMyAPI() {
            setShowLoading(true);
            await axios.get(url + "check/")
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                });
            console.log("values");
            await axios.get(url + "vignettes/")
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    setResData(res.data);
                });
            setShowLoading(false);
            setShowResult(true);
        }
        fetchMyAPI()
    }, [])

    const DataRows = [{ spz: "KK167CL", platnost: "Platná", link: "https://www.driving.co.uk/s3/st-driving-prod/uploads/2015/07/SUPERB-ESTATE-REVIEW-HEADER.jpg" },
    { spz: "BL123AX", platnost: "Neplatná", link: "https://www.driving.co.uk/s3/st-driving-prod/uploads/2015/07/SUPERB-ESTATE-REVIEW-HEADER.jpg" },
    { spz: "KE973TE", platnost: "Neplatná", link: "https://www.driving.co.uk/s3/st-driving-prod/uploads/2015/07/SUPERB-ESTATE-REVIEW-HEADER.jpg" }]

    let columns = [
        {
            title: "Špz",
            dataIndex: "spz",
            key: "spz",
        },
        {
            title: "Platnosť",
            dataIndex: "platnost",
            key: "platnost",
            render: (platnost: string,) => {
                const validity = platnost.includes("Platná");
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
        },
        {
            title: "Fotka",
            dataIndex: "link",
            key: "link",
            width: 20,
            render: (link: string) => {
                return (
                    <a target="_blank" href={link}>
                        <Button> Otvoriť </Button>
                    </a>
                );
            },
        },

    ];

    return (
        <>
            <Table dataSource={DataRows} columns={columns} />
        </>
    );
}
