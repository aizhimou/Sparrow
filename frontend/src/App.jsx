import { lazy, Suspense, useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute.jsx";
import {UserContext} from "./context/User/index.jsx";
import { Link, useNavigate } from 'react-router-dom';
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Home from "./pages/Home/index.jsx";
import Loading from "./components/Loading.jsx";
import NotFound from "./pages/NotFound/index.jsx";
import About from "./pages/About/index.jsx";
import Setting from "./pages/Setting/index.jsx";
import User from "./pages/User/index.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import PasswordResetForm from "./components/PasswordResetForm.jsx";
import {ConfigContext} from "./context/Config/index.jsx";
import {API, showError} from "./helpers/index.js";

function App({isDark, toggleColorScheme}) {

  const [userState, userDispatch] = useContext(UserContext);
  const [configState, configDispatch] = useContext(ConfigContext);
  let navigate = useNavigate();

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };

  const loadConfig = async () => {
    const res = await API.get('/api/config/public');
    const { code, msg, data } = res.data;
    if (code === 200) {
      // console.log("fetch config data:", data);
      configDispatch({ type: 'set', payload: data });
      // console.log("Config loaded successfully:", configState.config);
      localStorage.setItem("config", JSON.stringify(data));
    } else {
      showError(msg)
    }
  }

  useEffect(() => {
    loadUser();
    loadConfig().then();
  }, []);

  return (
      <>
      <Header isDark={isDark} toggleColorScheme={toggleColorScheme} />
      <Routes>
        <Route
            path='/'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Home />
              </Suspense>
            }
        />
        <Route
            path='/user'
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
        />
        {/*<Route
            path='/user/edit/:id'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <EditUser />
              </Suspense>
            }
        />
        <Route
            path='/user/edit'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <EditUser />
              </Suspense>
            }
        />
        <Route
            path='/user/add'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <AddUser />
              </Suspense>
            }
        />
        <Route
            path='/user/reset'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <PasswordResetConfirm />
              </Suspense>
            }
        />*/}
        <Route
            path='/login'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <LoginForm />
              </Suspense>
            }
        />
        <Route
            path='/register'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <RegisterForm />
              </Suspense>
            }
        />
        <Route
            path='/reset'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <PasswordResetForm />
              </Suspense>
            }
        />
        <Route
            path='/setting'
            element={
              <PrivateRoute>
                <Suspense fallback={<Loading></Loading>}>
                  <Setting />
                </Suspense>
              </PrivateRoute>
            }
        />
        <Route
            path='/about'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <About />
              </Suspense>
            }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      </>
  )
}

export default App
