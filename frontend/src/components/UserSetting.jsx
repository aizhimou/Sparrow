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
  let [loading, setLoading] = useState({
    password: false,
    email: false,
    emailCode: false,
  });


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
    const email = bindEmailForm.getValues().email;
    if (email === '') {
      return;
    }
    setLoading(loading => ({...loading, emailCode: true}));
    const user = {...userState.user, email};
    const res = await API.post(
        '/api/user/sendVerificationEmail', user
    );
    const {code, msg} = res.data;
    if (code === 200) {
      showSuccess('Verification code sent to your email, please check your inbox or spam folder.');
    } else {
      showError(msg);
    }
    setLoading(loading => ({...loading, emailCode: false}));
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
      <Stack>
        <Stack mt='lg'>
          <Title order={4}>Reset Password</Title>
          <form onSubmit={resetPasswordForm.onSubmit(
              (values) => resetPassword(values))}>
              <PasswordInput
                  name='oldPassword'
                  placeholder="Please enter your old password"
                  key={resetPasswordForm.key('oldPassword')}
                  {...resetPasswordForm.getInputProps('oldPassword')}
                  style={{flex: 1}}
              />
              <PasswordInput
                  mt='sm'
                   name='newPassword'
                   placeholder="Please enter new password"
                   key={resetPasswordForm.key('newPassword')}
                   {...resetPasswordForm.getInputProps('newPassword')}
                   style={{flex: 1}}
              />
            <Button mt='sm' loading={loading.password} type='submit' fullWidth>Confirm Reset</Button>
          </form>
        </Stack>
        <Divider/>
        <Stack mt='md'>
          <Title order={4}>Bind or rebind Email</Title>
          <form
              onSubmit={bindEmailForm.onSubmit((values) => bindEmail(values))}>
            <Group>
              <Input name='email'
                     placeholder="Please enter new email address"
                     key={bindEmailForm.key('email')}
                     {...bindEmailForm.getInputProps('email')}
                     style={{flex: 1}}
              />
              <Button variant="outline" loading={loading.emailCode} onClick={sendVerificationCode}>Get verification code</Button>
            </Group>
            <Input
                mt='sm'
                name='verificationCode'
                placeholder="Please enter verification code from your email."
                key={bindEmailForm.key('verificationCode')}
                {...bindEmailForm.getInputProps('verificationCode')}
            />
            <Button mt='sm' type='submit' loading={loading.email} fullWidth>Confirm Bind</Button>
          </form>
        </Stack>
      </Stack>
  );
}

export default UserSetting;