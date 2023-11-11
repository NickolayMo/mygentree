import {Suspense, useEffect, useState} from 'react';

import {TreeRoot} from '../TreeRoot/TreeRoot';
import {Layout, notification} from 'antd';
import {Route, Routes, useNavigate} from 'react-router-dom'
import {NotFound} from '../NotFound/NotFound';
import {AppHeader} from '../AppHeader/AppHeader';
import SignInForm from '../SignInForm/SignInForm';
import css from "./App.module.css"
import SignUpForm from "../SignUpForm/SignUpForm";
import {Home, UserInfo} from "../Home/Home";
import {Loader} from "../Loader/Loader";
import {ACCESS_TOKEN} from "../../constants";
import {TreeCreateForm} from "../TreeCreateForm/TreeCreateForm";
import {getCurrentUser} from "../../services/userService";

const {Content} = Layout;

export const App: React.FC = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<UserInfo>()

    notification.config({
        placement: 'topRight',
        top: 70,
        duration: 3,
    });

    useEffect(() => {
        loadCurrentUser()
    }, []);

    const loadCurrentUser = () => {
        setIsLoading(true)
        getCurrentUser()
            .then(response => {
                if (response.success === true) {
                    setIsLoading(false)
                    setCurrentUser(response.data)
                    setIsAuthenticated(true)
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleLogout = (
        redirectTo = "/",
        notificationCallback = () =>
            notification.success({
                message: "Моё дерево",
                description: "Вы успешно вышли из вашей учетной записи"
            })
    ) => {
        localStorage.removeItem(ACCESS_TOKEN)
        setIsAuthenticated(false)
        setCurrentUser(undefined)
        navigate(redirectTo)
        notificationCallback()
    }



    const handleLogin = () =>{
        notification.success({
            message: "Моё дерево",
            description: "Вы успешно вошли"
        })
        loadCurrentUser()
        navigate("/")
    }

    if (isLoading) {
        return <Loader/>
    }


    return (
        <Layout className="app-container">
            <AppHeader currentUser={currentUser} isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>
            <Content className={css.app_content}>
                <div className="container">
                    <Routes>
                        <Route path='/' Component={()=><Home handleLogout={handleLogout} currentUser={currentUser} isAuthenticated={isAuthenticated}/>}/>
                        <Route path='/tree/:id' Component={()=><TreeRoot handleLogout={handleLogout} currentUser={currentUser} isAuthenticated={isAuthenticated}/>}/>
                        <Route path='/sign_in' Component={()=><SignInForm handleLogin={handleLogin}/>}/>
                        <Route path='/sign_up' Component={SignUpForm}/>
                        <Route path='/tree/add' Component={TreeCreateForm}/>
                        <Route path='*' Component={NotFound}></Route>
                    </Routes>
                </div>
            </Content>
        </Layout>
    )
};
