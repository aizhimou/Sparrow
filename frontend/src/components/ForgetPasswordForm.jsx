import React, {useState} from "react";
import {
  Button, Container,
  Group,
  Image,
  Paper, PasswordInput,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import logo from "../assets/sparrow.svg";
import {useForm} from "@mantine/form";
import {API, showError, showSuccess} from "../helpers/index.js";
import {useNavigate} from "react-router-dom";

const ForgetPasswordForm = () => {

  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      verificationCode: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      // verificationCode: (value) => (value.length === 6 ? null : 'Verification code must be 6 characters long'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters long' : null),
      confirmPassword: (value, values) => (value !== values.password ? 'Passwords do not match' : null),
    }
  });

  const handleForgerPassword = async () => {
    let user = form.getValues();
    const res = await API.post('/api/auth/forgetPassword', user);
    const {code, msg, data} = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    showSuccess("Password reset successfully, please login with your new password.");
    form.reset();
    navigator('/login');
  }

  const getVerificationCode = async () => {
    setLoading(true);
    const email = form.getInputProps('email').value;
    if (!email) {
      showError('Please enter your email.');
      return;
    }
    const res = await API.get(`/api/auth/sendForgetPasswordVerificationCode?email=${email}`);
    const {code, msg} = res.data;
    if (code !== 200) {
      showError(msg);
      return;
    }
    setLoading(false);
    showSuccess('Verification code sent to your email, please check your inbox or spam folder.');
  }

  return (
      <Container pt="150px" size="xs">
        <Group justify="center">
          <Image src={logo} w={40}></Image>
          <Title>Reset Password</Title>
        </Group>
        <Paper p="xl" withBorder mt="md">
          <form onSubmit={form.onSubmit(handleForgerPassword)}>
            <Stack>
              <TextInput
                  name="email"
                  label="Email"
                  description="Please enter the email associated with your account"
                  placeholder="Please enter your email"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
              />
              <Group align='flex-end'>
                <TextInput
                    label="Verification Code"
                    name="verificationCode"
                    placeholder="Please enter the verification code"
                    description="We will send a verificationCode code to your email"
                    key={form.key('verificationCode')}
                    {...form.getInputProps('verificationCode')}
                    style={{flex: 1}}
                />
                <Button
                    variant="outline"
                    onClick={getVerificationCode}
                    loading={loading}
                >Get Code</Button>
              </Group>
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
              <Button
                  type='submit'
                  variant="gradient"
                  gradient={{from: 'blue', to: 'cyan', deg: 90}}
              >Submit</Button>
            </Stack>
          </form>
        </Paper>
      </Container>
  );
}

export default ForgetPasswordForm;