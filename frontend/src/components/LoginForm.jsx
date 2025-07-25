import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {UserContext} from '../context/User/index.jsx';
import {API, showError, showSuccess} from '../helpers'
import logo from '../assets/sparrow.svg';
import {
  Container,
  Group,
  Stack,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Anchor,
  Button, Image, Text
} from "@mantine/core";
import {useForm} from "@mantine/form";

const LoginForm = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [userState, userDispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("expired")) {
      showError('Not logged in or session expired, please login again.');
    }
  }, []);

  const loginForm = useForm({
    initialValues: {
      username: '',
      password: ''
    },
    validate: {
      username: (value) => (value.length >= 3 && value.length <= 20 ? null
          : 'Username must be between 3 and 20 characters'),
      password: (value) => (value.length >= 6 ? null
          : 'Password must be at least 6 characters long'),
    }
  })

  const login = async () => {
    setLoading(true);
    const user = loginForm.getValues();
    const res = await API.post('/api/auth/login', user);
    const {code, msg, data} = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    setLoading(false);
    userDispatch({type: 'login', payload: data});
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/');
  };

  const handleForgerPassword = async () => {
    const res = await API.get('/api/config/name/public?name=ForgetPasswordEnabled');
    const {code, msg, data} = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    if (data === 'true') {
      navigate('/forgetPassword');
    } else {
      showError('Forget password feature is not enabled.');
    }
  }

  const handleRegister = async () => {
    const res = await API.get('/api/config/name/public?name=RegisterEnabled');
    const {code, msg, data} = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    if (data === 'true') {
      navigate('/register');
    } else {
      showError('Register feature is not enabled.');
    }
  }

  return (
      <Container pt="150px" size="xs">
        <Group justify="center">
          <Image src={logo} w={60}></Image>
          <Title>Login</Title>
        </Group>
        <Paper p="xl" withBorder mt="md">
          <form onSubmit={loginForm.onSubmit(login)}>
            <Stack>
              <TextInput
                  name="username"
                  label="Username"
                  placeholder="Please enter your username"
                  key={loginForm.key('username')}
                  {...loginForm.getInputProps('username')}
              />
              <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="Please enter your password"
                  key={loginForm.key('password')}
                  {...loginForm.getInputProps('password')}
              />
              <Button
                  type='submit'
                  variant="gradient"
                  gradient={{from: 'blue', to: 'cyan', deg: 90}}
              >
                Submit</Button>
              <Group justify="space-between">
                <Anchor onClick={handleForgerPassword} size="sm"> Forgot password? </Anchor>
                <Anchor onClick={handleRegister} size="sm"> Register a account </Anchor>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
  );
};

export default LoginForm;
