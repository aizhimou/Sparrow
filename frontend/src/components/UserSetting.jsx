import React, {useContext, useEffect, useState} from "react";
import {API, showError, showSuccess} from "../helpers/index.js";
import {
  Button,
  Divider,
  Group,
  Input,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import {UserContext} from "../context/User/index.jsx";
import {hasLength, useForm} from "@mantine/form";

const UserSetting = () => {
  const [inputs, setInputs] = useState({
    old_password: '',
    new_password: '',
    email_verification_code: '',
    email: '',
  });

  const [status, setStatus] = useState({});
  const [userState, userDispatch] = useContext(UserContext);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
    }
  }, []);

  const handleInputChange = (e, {name, value}) => {
    setInputs((inputs) => ({...inputs, [name]: value}));
  };

  const resetPassword = async (values) => {
    console.log(userState.user.id);
    setLoading(true);
    const res = await API.post('/api/user/resetPassword', {
      id: userState.user.id,
      password: values.oldPassword,
      newPassword: values.newPassword,
    });
    const {code, msg} = res.data;
    if (code === 200) {
      showSuccess('Password reset successfully! Use new password to login next time.');
    } else {
      showError(msg);
    }
    setLoading(false);
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') {
      return;
    }
    setLoading(true);
    const res = await API.get(
        `/api/verification?email=${inputs.email}`
    );
    const {success, message} = res.data;
    if (success) {
      showSuccess('Verification code sent to your email!');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const bindEmail = async (values) => {
    setLoading(true);
    const res = await API.get(
        `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.email_verification_code}`
    );
    const {success, message} = res.data;
    if (success) {
      showSuccess('Email bound successfully! ');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const resetPasswordForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validate: {
      oldPassword: hasLength({min: 6},
          'Old password must be at least 6 characters long'),
      newPassword: hasLength({min: 6},
          'New password must be at least 6 characters long'),
    }
  });

  const bindEmailForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      verificationCode: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null
          : 'Invalid email address'),
      emailVerificationCode: hasLength({min: 6},
          'Verification code must be at least 6 characters long'),
    }
  });

  return (
      <Stack mt='md'>
        <Stack mb='xs'>
          <Title order={5}>Reset Password</Title>
          <form onSubmit={resetPasswordForm.onSubmit(
              (values) => resetPassword(values))}>
            <PasswordInput
                name='oldPassword'
                placeholder="Please enter your old password"
                key={resetPasswordForm.key('oldPassword')}
                {...resetPasswordForm.getInputProps('oldPassword')}
            />
            <PasswordInput mt='md'
                           name='newPassword'
                           placeholder="Please enter new password"
                           key={resetPasswordForm.key('newPassword')}
                           {...resetPasswordForm.getInputProps('newPassword')}
            />
            <Button mt='md' loading={loading} type='submit'>Submit</Button>
          </form>
        </Stack>
        <Divider/>
        <Stack>
          <Title order={5}>Bind Email</Title>
          <form
              onSubmit={bindEmailForm.onSubmit((values) => bindEmail(values))}>
            <Group>
              <Input name='email'
                     placeholder="Please enter new email address"
                     key={bindEmailForm.key('email')}
                     {...bindEmailForm.getInputProps('email')}
                     style={{flex: 1}}
              />
              <Button variant="outline" loading={loading} onClick={sendVerificationCode()}>Get verification code</Button>
            </Group>
            <Input
                name='verificationCode'
                placeholder="Please enter verification code from your email."
                key={bindEmailForm.key('verificationCode')}
                {...bindEmailForm.getInputProps('verificationCode')}
            />
            <Button type='submit' loading={loading}>Confirm</Button>
          </form>
        </Stack>
      </Stack>
  );
}

export default UserSetting;