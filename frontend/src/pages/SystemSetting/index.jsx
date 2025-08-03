import React, { useEffect, useState } from 'react';
import { API, showError, showSuccess } from '../../helpers/index.js';
import {
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';

const SystemSetting = () => {
  let [inputs, setInputs] = useState({
    RegisterEnabled: false,
    EmailVerificationEnabled: false,
    ForgetPasswordEnabled: false,
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPToken: '',
    Notice: '',
    About: '',
  });

  let [NoticeLoading, setNoticeLoading] = useState(false);
  let [SmtpLoading, setSmtpLoading] = useState(false);
  let [AboutLoading, setAboutLoading] = useState(false);

  let publicConfig = ['RegisterEnabled', 'EmailVerificationEnabled', 'ForgetPasswordEnabled'];

  const getOptions = async () => {
    const res = await API.get('/api/config/all');
    const { code, msg, data } = res.data;
    if (code === 200) {
      let newInputs = { ...inputs };
      data.forEach((item) => {
        newInputs[item.name] = item.value;
      });
      setInputs(newInputs);
    } else {
      showError(msg);
    }
  };

  useEffect(() => {
    getOptions().then();
  }, []);

  const handleInputChange = async (e, { name, value }) => {
    if (name === 'Notice' || name === 'About' || name.startsWith('SMTP')) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const setLoading = (name, loading) => {
    switch (name) {
      case 'Notice':
        setNoticeLoading(loading);
        break;
      case 'About':
        setAboutLoading(loading);
        break;
      case 'SMTP':
        setSmtpLoading(loading);
        break;
      default:
        break;
    }
  };

  const updateOption = async (name, value) => {
    setLoading(name, true);
    if (name.endsWith('Enabled')) {
      value = inputs[name] === 'true' ? 'false' : 'true';
    }
    const res = await API.post('/api/config/name', {
      name,
      value,
      isPublic: publicConfig.includes(name) ? 1 : 0,
    });
    const { code, msg } = res.data;
    if (code === 200) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
      showSuccess('Configuration updated successfully!');
    } else {
      showError(msg);
    }
    setLoading(name, false);
  };

  const updateSMTPConfig = async () => {
    setSmtpLoading(true);
    const SMTPConfig = [
      { name: 'SMTPServer', value: inputs.SMTPServer },
      { name: 'SMTPPort', value: inputs.SMTPPort },
      { name: 'SMTPAccount', value: inputs.SMTPAccount },
      { name: 'SMTPToken', value: inputs.SMTPToken },
    ];
    const res = await API.post('/api/config/batch', SMTPConfig);
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('SMTP configuration updated successfully!');
    } else {
      showError(msg);
    }
    setSmtpLoading(false);
  };

  return (
    <Container size="lg" mt="lg">
      <Stack>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>Notice Setting</Title>
            <Textarea
              name="Notice"
              label="Notice"
              description="This notice will be displayed on the homepage. If you dont want to show notice, just leave it empty."
              autosize
              minRows={3}
              value={inputs.Notice}
              placeholder="Enter notice content here, and if you dont want to show notice, just leave it empty."
              onChange={(e) => handleInputChange(e, { name: e.target.name, value: e.target.value })}
            />
            <Group justify="flex-end">
              <Button onClick={() => updateOption('Notice', inputs.Notice)} loading={NoticeLoading}>
                Save notice
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>Registration Settings</Title>
            <Group gap="xl">
              <Checkbox
                name="RegisterEnabled"
                label="Allow registration"
                checked={inputs.RegisterEnabled === 'true'}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.checked })
                }
              />
              <Checkbox
                name="EmailVerificationEnabled"
                label="Require email verification when registering"
                checked={inputs.EmailVerificationEnabled === 'true'}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.checked })
                }
              />
              <Checkbox
                name="ForgetPasswordEnabled"
                label="Allow forget password"
                checked={inputs.ForgetPasswordEnabled === 'true'}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.checked })
                }
              />
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>SMTP Settings</Title>
            <Group justify="space-between" gap="lg">
              <TextInput
                name="SMTPServer"
                label="SMTP Server"
                value={inputs.SMTPServer}
                placeholder="SMTP server address"
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <NumberInput
                name="SMTPPort"
                label="SMTP Port"
                value={inputs.SMTPPort}
                placeholder="SMTP server port"
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <TextInput
                name="SMTPAccount"
                label="SMTP Account"
                value={inputs.SMTPAccount}
                placeholder="SMTP account email"
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <PasswordInput
                name="SMTPToken"
                label="SMTP Token"
                value={inputs.SMTPToken}
                placeholder="SMTP account token or password"
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
            </Group>
            <Group justify="flex-end" mt="sm">
              <Button onClick={updateSMTPConfig} loading={SmtpLoading}>
                Save SMTP Configuration
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>About Setting</Title>
            <Textarea
              name="About"
              label="About Content"
              description="This content will be displayed on the about page. Markdown and HTML syntax are supported."
              autosize
              minRows={5}
              value={inputs.About}
              placeholder="Enter notice content here, and if you dont want to show notice, just leave it empty."
              onChange={(e) => handleInputChange(e, { name: e.target.name, value: e.target.value })}
            />
            <Group justify="flex-end" mt="sm">
              <Button onClick={() => updateOption('About', inputs.About)} loading={AboutLoading}>
                Save about
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SystemSetting;
