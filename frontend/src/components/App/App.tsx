import { Suspense, useEffect } from 'react';

import { TreeRoot } from '../TreeRoot/TreeRoot';
import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom'
import { NotFound } from '../NotFound/NotFound';
import { AppHeader } from '../AppHeader/AppHeader';
import SignInForm from '../SignInForm/SignInForm';
import css from "./App.module.css"
import SignUpForm from "../SignUpForm/SignUpForm";
const { Content } = Layout;

export const App: React.FC = () => {

  useEffect(() => {

  })

  return (
    <Layout className="app-container">
      <AppHeader />
      <Content className={css.app_content}>
        <div className="container">
          <Routes>
            <Route path='/' Component={() => { return (<div>faljflajfla</div>) }}></Route>
            <Route path='/tree/:id' Component={() => (
              <Suspense fallback={<p>Загрузка ...</p>}>
                <TreeRoot />
              </Suspense>
            )}>
            </Route>
            <Route path='/sign_in' Component={SignInForm}/>
            <Route path='/sign_up' Component={SignUpForm}/>
            <Route path='*' Component={NotFound}></Route>
          </Routes>
        </div>
      </Content>
    </Layout>
  )
};
