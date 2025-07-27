import {lazy, Suspense, useContext, useEffect} from 'react'
import {Route, Routes} from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute.jsx";
import {UserContext} from "./context/User/index.jsx";
import {useNavigate} from 'react-router-dom';
import LoginForm from "./components/LoginForm.jsx";
import Home from "./pages/Home/index.jsx";
import NotFound from "./pages/NotFound/index.jsx";
import About from "./pages/About/index.jsx";
import SystemSetting from "./pages/SystemSetting/index.jsx";
import UserSetting from "./pages/UserSetting/index.jsx";
import User from "./pages/User/index.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import ForgetPasswordForm from "./components/ForgetPasswordForm.jsx";
import Layout from "./components/Layout.jsx";
import {API, showError} from "./helpers/index.js";

function App() {

  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const loadUser = async () => {
    const res = await API.get('/api/account/info');
    const {code, msg, data} = res.data;
    if (code === 200) {
      userDispatch({type: 'login', payload: data});
    } else {
      showError(msg);
    }
  };

  useEffect(() => {
    loadUser().then();
  }, []);

  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path='user' element={<PrivateRoute><User/></PrivateRoute>}/>
          <Route path='systemSetting' element={<PrivateRoute><SystemSetting/></PrivateRoute>}/>
          <Route path='UserSetting' element={<PrivateRoute><UserSetting/></PrivateRoute>}/>
          <Route path='about' element={<PrivateRoute><About/></PrivateRoute>}/>

          <Route path='login' element={<LoginForm/>}/>
          <Route path='register' element={<RegisterForm/>}/>
          <Route path='forgetPassword' element={<ForgetPasswordForm/>}/>

          <Route path='*' element={<NotFound/>}/>
        </Route>
      </Routes>
  )
}

export default App
