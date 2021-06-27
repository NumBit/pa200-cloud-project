import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Layout } from 'antd';
import "./App.css";
import Buy from './buy/Buy';
import Home from './home/Home';
import Admin from './admin/Admin';
import MenuBar from './MenuBar';
import Check from './check/Check';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <MenuBar />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/buy">
                <Buy />
              </Route>
              <Route path="/check">
                <Check />
              </Route>
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/">
                <Home />
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
