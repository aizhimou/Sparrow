import React, { useEffect, useState } from 'react';
import {
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
import logo from '../assets/sparrow.svg';
import { API, showError, showSuccess } from '../helpers/index.js';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  let [emailVerificationEnabled, setEmailVerificationEnabled] = useState(null);
  let [loading, setLoading] = useState(false);
  let navigator = useNavigate();

  const fetchConfig = async () => {
    const res = await API.get('/api/public/config?name=EmailVerificationEnabled');
    const { code, msg, data } = res.data;
    if (code !== 200) {
      console.error(msg);
      return;
    }
    setEmailVerificationEnabled(data === 'true');
  };

  useEffect(() => {
    fetchConfig().then();
  }, []);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
    },
    validate: {
      username: (value) =>
        3 <= value.length && value.length <= 10
          ? null
          : 'Username must be between 3 and 20 characters',
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters long' : null,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      email: (value) =>
        emailVerificationEnabled
          ? /^\S+@\S+$/.test(value)
            ? null
            : 'Invalid email address'
          : null,
    },
  });

  const handleRegister = async () => {
    const user = form.getValues();
    if (form.validate().hasErrors) {
      return;
    }
    const res = await API.post('/api/auth/register', user);
    const { code, msg, data } = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    showSuccess('Registration successful, please login.');
    navigator('/login');
  };

  const getVerificationCode = async () => {
    setLoading(true);
    const email = form.getInputProps('email').value;
    const res = await API.get(`/api/auth/send-registration-verification-code?email=${email}`);
    const { code, msg } = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    setLoading(false);
    showSuccess('Verification code sent to your email. Please check your inbox or spam folder.');
  };

  return (
    <Container pt="150px" size="xs">
      <Group justify="center">
        <Image src={logo} w={40}></Image>
        <Title>Register</Title>
      </Group>
      <Paper p="xl" withBorder mt="md">
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Stack>
            <TextInput
              label="Username"
              name="username"
              description="Username must be between 3 and 20 characters"
              placeholder="Please enter your username"
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Password"
              name="password"
              description="Password must be at least 6 characters long"
              placeholder="Please enter your password"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              description="Please enter your password again to confirm"
              placeholder="Please enter your password again"
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            {emailVerificationEnabled ? (
              <>
                <TextInput
                  label="Email"
                  name="email"
                  placeholder="Please enter your email"
                  description="Please enter a valid email address"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                  style={{ flex: 1 }}
                />
                <Group align="flex-end">
                  <TextInput
                    label="Verification Code"
                    name="verificationCode"
                    placeholder="Please enter the verification code"
                    key={form.key('verificationCode')}
                    {...form.getInputProps('verificationCode')}
                    style={{ flex: 1 }}
                  />
                  <Button variant="outline" onClick={getVerificationCode} loading={loading}>
                    Get Code
                  </Button>
                </Group>
              </>
            ) : (
              <></>
            )}
            <Button
              mt="sm"
              fullWidth
              variant="gradient"
              type="submit"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
