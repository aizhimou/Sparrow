import React, { useContext, useState } from 'react';
import { API, showError, showSuccess } from '../../helpers/index.js';
import {
  Button,
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { UserContext } from '../../context/User/UserContext.jsx';
import { hasLength, useForm } from '@mantine/form';

const UserSetting = () => {
  const [state,] = useContext(UserContext);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [bindEmailLoading, setBindEmailLoading] = useState(false);
  const [getCodeLoading, setGetCodeLoading] = useState(false);

  const resetPassword = async (values) => {
    setResetPasswordLoading(true);
    const res = await API.post('/api/account/resetPassword', {
      id: state.user.id,
      password: values.oldPassword,
      newPassword: values.newPassword,
    });
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('Password reset successfully! Use new password to login next time.');
    } else {
      showError(msg);
    }
    setResetPasswordLoading(false);
  };

  const sendVerificationCode = async () => {
    const email = bindEmailForm.getValues().getVerificationCode;
    if (email === '') {
      return;
    }
    setGetCodeLoading(true);
    const user = { ...state.user, getVerificationCode: email };
    const res = await API.post('/api/account/sendVerificationEmail', user);
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('Verification code sent to your email, please check your inbox or spam folder.');
    } else {
      showError(msg);
    }
    setGetCodeLoading(false);
  };

  const bindEmail = async () => {
    setBindEmailLoading(true);
    const user = {
      ...state.user,
      getVerificationCode: bindEmailForm.getValues().getVerificationCode,
      verificationCode: bindEmailForm.getValues().verificationCode,
    };
    const res = await API.get('/api/account/bindEmail', user);
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('Email bound successfully! ');
    } else {
      showError(msg);
    }
    setBindEmailLoading(false);
  };

  const resetPasswordForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validate: {
      oldPassword: hasLength({ min: 6 }, 'Old password must be at least 6 characters long'),
      newPassword: hasLength({ min: 6 }, 'New password must be at least 6 characters long'),
    },
  });

  const bindEmailForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      verificationCode: '',
    },
    validate: {
      getVerificationCode: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address',
      emailVerificationCode: hasLength(
        { min: 6 },
        'Verification code must be at least 6 characters long',
      ),
    },
  });

  return (
    <Container size="lg" mt="lg">
      <Stack>
        <Stack mt="lg">
          <Title order={4}>Reset Password</Title>
          <form onSubmit={resetPasswordForm.onSubmit((values) => resetPassword(values))}>
            <PasswordInput
              name="oldPassword"
              label="Old Password"
              placeholder="Please enter your old password"
              key={resetPasswordForm.key('oldPassword')}
              {...resetPasswordForm.getInputProps('oldPassword')}
              style={{ flex: 1 }}
            />
            <PasswordInput
              mt="sm"
              name="newPassword"
              label="New Password"
              placeholder="Please enter new password"
              key={resetPasswordForm.key('newPassword')}
              {...resetPasswordForm.getInputProps('newPassword')}
              style={{ flex: 1 }}
            />
            <Button mt="sm" loading={resetPasswordLoading} type="submit" fullWidth>
              Confirm Reset
            </Button>
          </form>
        </Stack>
        <Divider />
        <Stack mt="md">
          <Title order={4}>Bind or rebind Email</Title>
          <form onSubmit={bindEmailForm.onSubmit((values) => bindEmail(values))}>
            <Group align="flex-end">
              <TextInput
                name="email"
                label="Email"
                placeholder="Please enter new email address"
                key={bindEmailForm.key('email')}
                {...bindEmailForm.getInputProps('email')}
                style={{ flex: 1 }}
              />
              <Button variant="outline" loading={getCodeLoading} onClick={sendVerificationCode}>
                Get Code
              </Button>
            </Group>
            <TextInput
              mt="sm"
              name="verificationCode"
              label="Verification Code"
              placeholder="Please enter verification code from your email."
              key={bindEmailForm.key('verificationCode')}
              {...bindEmailForm.getInputProps('verificationCode')}
            />
            <Button mt="sm" type="submit" loading={bindEmailLoading} fullWidth>
              Confirm Bind
            </Button>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
};

export default UserSetting;
