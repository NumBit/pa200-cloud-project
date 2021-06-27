import { Button, Table } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Row {
    spz: string;
}

interface DataQuery {
    rows: Row[];
}

export default function Admin(){
    //const { loading, error, data, refetch } =        useQuery<allSemestersReply>(SEMESTER_LIST_QUERY);

    useEffect(() => {
        //fetch();
    }, []);

/*
    if (loading)
        return (
            <Skeleton
                className={"detail-skeleton"}
                active
                paragraph={{ rows: 13 }}
            />
        );
*/

 //   if (error || !data) return <ServerError />;

/*
    const DataRows = data.rows.map((row: Row) => {
        return {
            id: row.id,
            spz: row.spz,
        };
    });
*/
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
        },
        {
            title: "",
            dataIndex: "id",
            key: "id",
            width: 20,
            render: (id: number) => {
                const path = `semester/${id}/edit`;
                return (
                    <Link to={path}>
                        <Button> Edit </Button>
                    </Link>
                );
            },
        },

    ];

    return (
        <>
            <Table dataSource={[]} columns={columns} />
        </>
    ); 
}
