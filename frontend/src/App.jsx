import {lazy, Suspense, useContext, useEffect} from 'react'
import {Route, Routes} from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute.jsx";
import {UserContext} from "./context/User/index.jsx";
import {Link, useNavigate} from 'react-router-dom';
import Header from "./components/Header.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Home from "./pages/Home/index.jsx";
import NotFound from "./pages/NotFound/index.jsx";
import About from "./pages/About/index.jsx";
import Setting from "./pages/Setting/index.jsx";
import User from "./pages/User/index.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import ForgetPasswordForm from "./components/ForgetPasswordForm.jsx";
import {ConfigContext} from "./context/Config/index.jsx";
import {API, showError} from "./helpers/index.js";
import Layout from "./components/Layout.jsx";

function App() {

  const [userState, userDispatch] = useContext(UserContext);
  const [configState, configDispatch] = useContext(ConfigContext);
  let navigate = useNavigate();

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({type: 'login', payload: data});
    } else {
      navigate("/login")
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='login' element={<LoginForm/>}/>
          <Route path='register' element={<RegisterForm/>}/>
          <Route path='forgetPassword' element={<ForgetPasswordForm/>}/>
          <Route path='setting' element={<Setting/>}/>
          <Route path='user' element={<User/>}/>
          <Route path='about' element={<About/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Route>
      </Routes>
  )
}

export default App
