import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {UserContext} from '../context/User/index.jsx';
import {API, showError, showSuccess} from '../helpers'
import logo from '../assets/react.svg'
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
import {ConfigContext} from "../context/Config/index.jsx";

const LoginForm = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [userState, userDispatch] = useContext(UserContext);
  const [configState, configDispatch] = useContext(ConfigContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("expired")) {
      showError('Not logged in or session expired, please login again.');
    }
    console.log(configState.config)
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
    userDispatch({ type: 'login', payload: data });
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/');
  };

  return (
      <Container pt="150px" size="xs">
        <Group justify="center">
          <Image src={logo} w={40}></Image>
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
              <Button type='submit'>Submit</Button>
              <Group justify="space-between">
                {/*{configState.config.ForgetPasswordEnabled ?
                    <Anchor component={Link} to="/reset" size="sm"> Forgot
                      password? </Anchor>
                    : <></>
                }*/}
                {/*{configState.config.RegisterEnabled ?
                    <Anchor component={Link} to="/register" size="sm"> Register a
                      account </Anchor>
                    : <></>
                }*/}
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
  );
};

export default LoginForm;
