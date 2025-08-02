import React, { useContext, useState } from 'react';
import { API, showError, showSuccess } from '../../helpers/index.js';
import {
  Button,
  Container,
  Paper,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title, Badge, Text, Modal, PinInput
} from '@mantine/core';
import { UserContext } from '../../context/User/UserContext.jsx';
import { hasLength, useForm } from '@mantine/form';
import {useDisclosure} from "@mantine/hooks";
import {IconAt, IconLock} from "@tabler/icons-react";

const UserSetting = () => {
  const [state] = useContext(UserContext);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [bindEmailLoading, setBindEmailLoading] = useState(false);
  const [getCodeLoading, setGetCodeLoading] = useState(false);
  const [resetPasswordOpened, { open: openResetPassword, close: closeResetPassword }] = useDisclosure(false);
  const [bindEmailOpened, { open: openBindEmail, close: closeBindEmail }] = useDisclosure(false);

  const resetPassword = async (values) => {
    setResetPasswordLoading(true);
    const res = await API.post('/api/account/reset-password', {
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
    const res = await API.post('/api/account/send-verification-email', user);
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
    const res = await API.get('/api/account/bind-email', user);
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('Email bound successfully! ');
    } else {
      showError(msg);
    }
    setBindEmailLoading(false);
  };

  const generateApiKey = async () => {
    const res = await API.get('/api/account/generate-api-key');
    const { code, msg, data } = res.data;
    if (code === 200) {
      showSuccess('API Key generated successfully!');
      // Update the user state with the new API key
      state.user.apiKey = data.apiKey;
    } else {
      showError(msg);
    }
  }

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
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>Current State</Title>
            <Group>
              <Text c="dimmed">Username:</Text>
              <Text>{state.user.username}</Text>
            </Group>
            <Group>
              <Text c="dimmed">Role:</Text>
              <Badge variant="light" radius="sm">{state.user.role}</Badge>
            </Group>
            <Group>
              <Text c="dimmed">Email:</Text>
              <Text>{state.user.email ? state.user.email : 'Not set' }</Text>
            </Group>
            <Group>
              <Text c="dimmed">API Key:</Text>
              <Text>{state.user.apiKey ? state.user.apiKey : 'Not set'}</Text>
            </Group>
            <Group>
              <Button size='xs' onClick={openResetPassword}>Reset Password</Button>
              <Button size='xs' onClick={openBindEmail}>
                {state.user.email ? 'Rebind Email' : 'Bind Email'}
              </Button>
              <Button size='xs' onClick={generateApiKey}>
                {state.user.apiKey ? 'Generate API Key' : 'Re-Generate API Key'}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>

      <Modal opened={resetPasswordOpened} onClose={closeResetPassword} title="Reset Password" centered>
        <form onSubmit={resetPasswordForm.onSubmit((values) => resetPassword(values))}>
          <PasswordInput
              name="oldPassword"
              label="Old Password"
              withAsterisk
              leftSection={<IconLock size={16} />}
              placeholder="Please enter your old password"
              key={resetPasswordForm.key('oldPassword')}
              {...resetPasswordForm.getInputProps('oldPassword')}
              style={{ flex: 1 }}
          />
          <PasswordInput
              mt="sm"
              name="newPassword"
              label="New Password"
              withAsterisk
              leftSection={<IconLock size={16} />}
              placeholder="Please enter new password"
              key={resetPasswordForm.key('newPassword')}
              {...resetPasswordForm.getInputProps('newPassword')}
              style={{ flex: 1 }}
          />
          <Group justify="flex-end" mt="sm">
            <Button mt="sm" loading={resetPasswordLoading} type="submit">
              Confirm Reset
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={bindEmailOpened} onClose={closeBindEmail} title="Bind Email" centered>
        <form onSubmit={bindEmailForm.onSubmit((values) => bindEmail(values))}>
          <Group align="flex-end">
            <TextInput
                name="email"
                label="Email"
                withAsterisk
                leftSection={<IconAt size={16} />}
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
              withAsterisk
              label="Verification Code"
              placeholder="Please enter verification code from your email."
              key={bindEmailForm.key('verificationCode')}
              {...bindEmailForm.getInputProps('verificationCode')}
          />
          <Group justify="flex-end" mt="sm">
            <Button mt="sm" type="submit" loading={bindEmailLoading}>
              Confirm Bind
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default UserSetting;
