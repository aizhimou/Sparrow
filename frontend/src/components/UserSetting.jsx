import React, {useContext, useEffect, useState} from "react";
import {API, showError, showSuccess} from "../helpers/index.js";
import {
  Button,
  Divider,
  Group,
  Input, PasswordInput,
  Stack,
  TextInput,
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
  const [showEmailBindModal, setShowEmailBindModal] = useState(false);
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
      showSuccess('Password reset successfully! Login again to see the changes.');
    } else {
      showError(msg);
    }
    setLoading(false);
  }

  const generateToken = async () => {
    const res = await API.get('/api/user/token');
    const {success, message, data} = res.data;
    if (success) {
      showSuccess(`令牌已重置并已复制到剪贴板：${data}`);
    } else {
      showError(message);
    }
  };

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
      showSuccess('验证码发送成功，请检查邮箱！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const bindEmail = async () => {
    if (inputs.email_verification_code === '') {
      return;
    }
    setLoading(true);
    const res = await API.get(
        `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.email_verification_code}`
    );
    const {success, message} = res.data;
    if (success) {
      showSuccess('邮箱账户绑定成功！');
      setShowEmailBindModal(false);
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
      oldPassword: hasLength({min: 6}, 'Old password must be at least 6 characters long'),
      newPassword: hasLength({min: 6}, 'New password must be at least 6 characters long'),
    }
  });

  return (
      <Stack mt='md'>
        <Stack mb='xs'>
          <Title order={5}>Reset Password</Title>
          <form onSubmit={resetPasswordForm.onSubmit((values) => resetPassword(values))}>
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
        <Stack mb='xs'>
          <Title order={5}>Reset Password</Title>
          <TextInput name='old_password' placeholder="Please enter your old password" onChange={handleInputChange}/>
          <TextInput name='new_password' placeholder="Please enter new password" onChange={handleInputChange}/>
          <Button loading={loading} onClick={resetPassword}>Submit</Button>
        </Stack>
        <Divider/>
        <Stack>
          <Title order={5}>Bind Email</Title>
          <Group>
            <Input placeholder="Please enter new email address" style={{ flex: 1 }}></Input>
            <Button variant="outline" loading={loading}>Get verification code</Button>
          </Group>
          <Input placeholder="Verification Code"></Input>
          <Button>Confirm</Button>
        </Stack>
      </Stack>
  );
}

export default UserSetting;