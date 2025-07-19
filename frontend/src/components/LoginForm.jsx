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

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const {username, password} = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [status, setStatus] = useState({});

  useEffect(() => {
    if (searchParams.get("expired")) {
      showError('未登录或登录已过期，请重新登录！');
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
    }
  }, []);

  function handleChange(e) {
    const {name, value} = e.target;
    setInputs((inputs) => ({...inputs, [name]: value}));
  }

  async function handleSubmit(e) {
    setSubmitted(true);
    if (username && password) {
      const res = await API.post('/api/login', {
        username,
        password,
      });
      const {code, msg, data} = res.data;
      if (code === 200) {
        userDispatch({type: 'login', payload: data});
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
        showSuccess('登录成功！');
      } else {
        showError(msg);
      }
    }
  }

  return (
      <>
      <Container pt="150px" size="xs">
        <Group justify="center">
          <Image src={logo} w={40}></Image>
          <Title>Login</Title>
        </Group>
        <Paper p="xl" withBorder mt="md">
          <Stack>
            <TextInput name="username" label="Username" placeholder="Please enter your username" onChange={handleChange}/>
            <PasswordInput name="password" label="Password" placeholder="Please enter your password" onChange={handleChange}/>
            <Button fullWidth onClick={handleSubmit}>Submit</Button>
            <Group justify="space-between">
              <Anchor component={Link} to="/reset" size="sm"> Forgot password? </Anchor>
              <Anchor component={Link} to="/reset" size="sm"> Register a account </Anchor>
            </Group>
          </Stack>
        </Paper>
      </Container>
      </>
  );
};

export default LoginForm;
