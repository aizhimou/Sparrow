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
import { useTranslation } from 'react-i18next';

import logo from '../assets/sparrow.svg';
import { API, showError, showSuccess } from '../helpers/index.js';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  let [emailVerificationEnabled, setEmailVerificationEnabled] = useState(null);
  let [loading, setLoading] = useState(false);
  let navigator = useNavigate();
  const { t } = useTranslation();

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
          : t('username_length_tip'),
      password: (value) =>
        value.length < 6 ? t('password_length_tip') : null,
      confirmPassword: (value, values) =>
        value !== values.password ? t('password_not_match') : null,
      email: (value) =>
        emailVerificationEnabled
          ? /^\S+@\S+$/.test(value)
            ? null
            : t('invalid_email')
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
    showSuccess(t('register_success'));
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
    showSuccess(t('code_sent'));
  };

  return (
    <Container pt="150px" size="xs">
      <Group justify="center">
        <Image src={logo} w={40}></Image>
        <Title>{t('register')}</Title>
      </Group>
      <Paper p="xl" withBorder mt="md">
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Stack>
            <TextInput
              label={t('username')}
              name="username"
              description={t('username_length_tip')}
              placeholder={t('username_placeholder')}
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label={t('password')}
              name="password"
              description={t('password_length_tip')}
              placeholder={t('password_placeholder')}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label={t('confirm_password')}
              name="confirmPassword"
              description={t('confirm_password_description')}
              placeholder={t('confirm_password_placeholder')}
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            {emailVerificationEnabled ? (
              <>
                <TextInput
                  label={t('email')}
                  name="email"
                  placeholder={t('email_placeholder')}
                  description={t('email_description')}
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                  style={{ flex: 1 }}
                />
                <Group align="flex-end">
                  <TextInput
                    label={t('verification_code')}
                    name="verificationCode"
                    placeholder={t('verification_code_placeholder')}
                    description={t('verification_code_description')}
                    key={form.key('verificationCode')}
                    {...form.getInputProps('verificationCode')}
                    style={{ flex: 1 }}
                  />
                  <Button variant="outline" onClick={getVerificationCode} loading={loading}>
                    {t('get_code')}
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
              {t('submit')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
