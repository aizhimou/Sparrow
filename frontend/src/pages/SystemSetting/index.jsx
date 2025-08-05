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
import { useTranslation } from 'react-i18next';

const SystemSetting = () => {
  const { t } = useTranslation();
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
            <Title order={4}>{t('notice_setting')}</Title>
            <Textarea
              name="Notice"
              label={t('notice')}
              autosize
              minRows={3}
              value={inputs.Notice}
              placeholder={t('enter_notice_content')}
              onChange={(e) => handleInputChange(e, { name: e.target.name, value: e.target.value })}
            />
            <Group justify="flex-end">
              <Button onClick={() => updateOption('Notice', inputs.Notice)} loading={NoticeLoading}>
                {t('save_notice')}
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>{t('registration_settings')}</Title>
            <Group gap="xl">
              <Checkbox
                name="RegisterEnabled"
                label={t('allow_registration')}
                checked={inputs.RegisterEnabled === 'true'}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.checked })
                }
              />
              <Checkbox
                name="EmailVerificationEnabled"
                label={t('require_email_verification')}
                checked={inputs.EmailVerificationEnabled === 'true'}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.checked })
                }
              />
              <Checkbox
                name="ForgetPasswordEnabled"
                label={t('allow_forget_password')}
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
            <Title order={4}>{t('smtp_settings')}</Title>
            <Group justify="space-between" gap="lg">
              <TextInput
                name="SMTPServer"
                label={t('smtp_server')}
                value={inputs.SMTPServer}
                placeholder={t('smtp_server_address')}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <NumberInput
                name="SMTPPort"
                label={t('smtp_port')}
                value={inputs.SMTPPort}
                placeholder={t('smtp_server_port')}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <TextInput
                name="SMTPAccount"
                label={t('smtp_account')}
                value={inputs.SMTPAccount}
                placeholder={t('smtp_account_email')}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
              <PasswordInput
                name="SMTPToken"
                label={t('smtp_token')}
                value={inputs.SMTPToken}
                placeholder={t('smtp_token_or_password')}
                onChange={(e) =>
                  handleInputChange(e, { name: e.target.name, value: e.target.value })
                }
                style={{ flex: 1 }}
              />
            </Group>
            <Group justify="flex-end" mt="sm">
              <Button onClick={updateSMTPConfig} loading={SmtpLoading}>
                {t('save_smtp_configuration')}
              </Button>
            </Group>
          </Stack>
        </Paper>
        <Paper shadow="xs" p="md">
          <Stack>
            <Title order={4}>{t('about_setting')}</Title>
            <Textarea
              name="About"
              label={t('about_content')}
              autosize
              minRows={5}
              value={inputs.About}
              placeholder={t('enter_about_content')}
              onChange={(e) => handleInputChange(e, { name: e.target.name, value: e.target.value })}
            />
            <Group justify="flex-end" mt="sm">
              <Button onClick={() => updateOption('About', inputs.About)} loading={AboutLoading}>
                {t('save_about')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SystemSetting;
