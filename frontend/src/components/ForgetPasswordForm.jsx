import React, { useState } from 'react';
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
import logo from '../assets/sparrow.svg';
import { useForm } from '@mantine/form';
import { API, showError, showSuccess } from '../helpers/index.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      email: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('invalid_email')),
      password: (value) =>
        value.length < 6 ? t('password_length_tip') : null,
      confirmPassword: (value, values) =>
        value !== values.password ? t('password_not_match') : null,
    },
  });

  const handleForgerPassword = async () => {
    let user = form.getValues();
    const res = await API.post('/api/auth/forget-password', user);
    const { code, msg } = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    showSuccess(t('reset_success'));
    form.reset();
    navigator('/login');
  };

  const getVerificationCode = async () => {
    setLoading(true);
    const email = form.getInputProps('email').value;
    if (!email) {
      showError(t('please_enter_email'));
      return;
    }
    const res = await API.get(`/api/auth/send-forget-password-verification-code?email=${email}`);
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
        <Title>{t('forget_password')}</Title>
      </Group>
      <Paper p="xl" withBorder mt="md">
        <form onSubmit={form.onSubmit(handleForgerPassword)}>
          <Stack>
            <TextInput
              name="email"
              label={t('email')}
              description={t('email_description')}
              placeholder={t('email_placeholder')}
              key={form.key('email')}
              {...form.getInputProps('email')}
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
            <Button
              type="submit"
              variant="gradient"
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

export default ForgetPasswordForm;
