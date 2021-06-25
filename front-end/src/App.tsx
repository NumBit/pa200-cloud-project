import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import "./App.css";


const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo">
            <h1 className="logo-text">
              <Link to="/">E-známka</Link>
            </h1>
          </div>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item className="menu-item" key="/buy">Kúpiť</Menu.Item>
          </Menu>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item className="menu-item" key="/check">Overiť</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/buy">
                <h1>BUY</h1>
              </Route>
              <Route path="/check">
                <h1>CHECK</h1>
              </Route>
              <Route path="/">
                <h1>HOME</h1>
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>E-známka ©2021</Footer>
      </Layout>
    </Router>
  );
}

export default App;
