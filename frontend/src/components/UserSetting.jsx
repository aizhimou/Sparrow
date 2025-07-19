import React, {useEffect, useState} from "react";
import {API, showError, showSuccess} from "../helpers/index.js";
import {
  Button,
  Container, Divider, Flex, Box,
  Group,
  Input,
  Stack,
  TextInput,
  Title,
  Tooltip
} from "@mantine/core";

const UserSetting = () => {
  const [inputs, setInputs] = useState({
    email_verification_code: '',
    email: '',
  });
  const [status, setStatus] = useState({});
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

  return (
      <Stack mt='md'>
        <Stack mb='xs'>
          <Title order={5}>Reset Password</Title>
          <Group>
            <Input placeholder="Please enter new password" style={{ flex: 1 }}></Input>
            <Button>Submit</Button>
          </Group>
        </Stack>
        <Divider/>
        <Stack>
          <Title order={5}>Bind Email</Title>
          <Group>
            <Input placeholder="Please enter new email address" style={{ flex: 1 }}></Input>
            <Button>Get verification code</Button>
          </Group>
          <Input placeholder="Verification Code"></Input>
          <Button>Confirm</Button>
        </Stack>
      </Stack>
  );
}

export default UserSetting;