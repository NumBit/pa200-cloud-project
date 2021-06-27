import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export default function MenuBar() {
    return (
        <>
            <div className="logo">
                <h1 className="logo-text">
                    <Link to="/">E-známka</Link>
                </h1>
            </div>
            <Menu theme="dark" mode="horizontal">
                <Menu.Item className="menu-item" key="/buy"><Link to="/buy">Kúpiť</Link></Menu.Item>
                <Menu.Item className="menu-item" key="/check"><Link to="/check">Overiť</Link></Menu.Item>
                <Menu.Item className="menu-item" key="/admin"><Link to="/admin">Admin</Link></Menu.Item>
            </Menu>
        </>
    );
}