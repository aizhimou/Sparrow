import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User/UserContext.jsx';
import { API, showError } from '../helpers';
import logo from '../assets/sparrow.svg';
import {
  Anchor,
  Button,
  Container,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const [, dispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError('Not logged in or session expired, please login again.');
    }
  }, []);

  const loginForm = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) =>
        value.length >= 3 && value.length <= 20
          ? null
          : 'Username must be between 3 and 20 characters',
      password: (value) =>
        value.length >= 6 ? null : 'Password must be at least 6 characters long',
    },
  });

  const login = async () => {
    setLoading(true);
    const user = loginForm.getValues();
    const res = await API.post('/api/auth/login', user);
    const { code, msg, data } = res.data;
    if (code !== 200) {
      showError(msg);
      setLoading(false);
      return;
    }
    setLoading(false);
    dispatch({ type: 'login', payload: data });
    localStorage.setItem('user', JSON.stringify(data));
    navigate('/');
  };

  const handleForgerPassword = async () => {
    const res = await API.get('/api/public/config?name=ForgetPasswordEnabled');
    const { code, msg, data } = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    if (data === 'true') {
      navigate('/forget-password');
    } else {
      showError('Forget password feature is not enabled.');
    }
  };

  const handleRegister = async () => {
    const res = await API.get('/api/public/config?name=RegisterEnabled');
    const { code, msg, data } = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    if (data === 'true') {
      navigate('/register');
    } else {
      showError('Register feature is not enabled.');
    }
  };

  return (
    <Container pt="150px" size="xs">
      <Group justify="center">
        <Image src={logo} w={60}></Image>
        <Title>{t('login')}</Title>
      </Group>
      <Paper p="xl" withBorder mt="md">
        <form onSubmit={loginForm.onSubmit(login)}>
          <Stack>
            <TextInput
              name="username"
              label={t('username')}
              placeholder={t('username_placeholder')}
              key={loginForm.key('username')}
              {...loginForm.getInputProps('username')}
            />
            <PasswordInput
              name="password"
              label={t('password')}
              placeholder={t('password_placeholder')}
              key={loginForm.key('password')}
              {...loginForm.getInputProps('password')}
            />
            <Button
              type="submit"
              variant="gradient"
              loading={loading}
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
              {t('login')}
            </Button>
            <Group justify="space-between">
              <Anchor onClick={handleForgerPassword} size="sm">
                {t('forgot_password')}
              </Anchor>
              <Anchor onClick={handleRegister} size="sm">
                {t('register_account')}
              </Anchor>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
