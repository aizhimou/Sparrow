import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import { UserContext } from './context/User/UserContext.jsx';
import LoginForm from './components/LoginForm.jsx';
import Home from './pages/Home/index.jsx';
import NotFound from './pages/NotFound/index.jsx';
import About from './pages/About/index.jsx';
import SystemSetting from './pages/SystemSetting/index.jsx';
import UserSetting from './pages/UserSetting/index.jsx';
import User from './pages/User/index.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import ForgetPasswordForm from './components/ForgetPasswordForm.jsx';
import Layout from './components/Layout.jsx';
import Forbidden from './pages/Forbidden/index.jsx';

function App() {
  const [, dispatch] = useContext(UserContext);

  const loadUser = async () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      dispatch({ type: 'login', payload: data });
    }
  };

  useEffect(() => {
    loadUser().then();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="user"
          element={
            <PrivateRoute requireAdmin={true}>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="system-setting"
          element={
            <PrivateRoute requireAdmin={true}>
              <SystemSetting />
            </PrivateRoute>
          }
        />
        <Route
          path="user-setting"
          element={
            <PrivateRoute>
              <UserSetting />
            </PrivateRoute>
          }
        />
        <Route
          path="about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />

        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forget-password" element={<ForgetPasswordForm />} />
        <Route path="403" element={<Forbidden />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
