import React from "react";
import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Image,
  Input,
  Paper, PasswordInput, Stack, TextInput,
  Title
} from "@mantine/core";
import {useForm} from "@mantine/form";
import logo from "../assets/react.svg";
import {UserContext} from "../context/User/index.jsx";
import {ConfigContext} from "../context/Config/index.jsx";

const RegisterForm = () => {

  const [ConfigState, ConfigDispatch] = React.useContext(ConfigContext);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: ''
    },
    validate: {
      username: (value) => (3 <= value.length && value.length <= 10 ? null
          : 'Username must be between 3 and 20 characters'),
      password: (value) => (value.length < 6
          ? 'Password must be at least 6 characters long' : null),
      confirmPassword: (value, values) => (value !== values.password
          ? 'Passwords do not match' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null
          : 'Invalid email address'),
      verificationCode: (value) => (value.length === 6) ? null
          : 'Verification code must be 6 characters long',
    }
  })

  const handleRegister = (values) => {
    console.log('Registering user with values:', values);
  }

  const getVerificationCode = async (email) => {
  }

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
              {ConfigState.EmailVerificationEnabled && (
                  <>
                    <TextInput
                        label="Email"
                        name="email"
                        placeholder="Please enter your email"
                        description="Please enter a valid email address"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                        style={{flex: 1}}
                    />
                    <Group align='flex-end'>
                      <TextInput
                          label="Verification Code"
                          name="verificationCode"
                          placeholder="Please enter the verification code"
                          key={form.key('verificationCode')}
                          {...form.getInputProps('verificationCode')}
                          style={{flex: 1}}
                      />
                      <Button variant="outline">Get verification code</Button>
                    </Group>
                  </>
              )}
              <Button
                  mt='sm'
                  fullWidth
                  variant="gradient"
                  type='submit'
                  gradient={{from: 'blue', to: 'cyan', deg: 90}}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
  )
}

export default RegisterForm;