import React, {useEffect, useState} from "react";
import {API, showError, showSuccess} from "../helpers/index.js";
import {
  Button, Checkbox,
  TextInput,
  Divider,
  Group,
  Stack,
  Textarea,
  Title
} from "@mantine/core";

const SystemSetting = () => {

  let [inputs, setInputs] = useState({
    RegisterEnabled: false,
    EmailVerificationEnabled: false,
    PasswordResetEnabled: false,
    SMTPServer: '',
    SMTPPort: '',
    SMTPAccount: '',
    SMTPToken: '',
    Notice: '',
    About: '',
  });

  let [loading, setLoading] = useState({
      Notice: false,
      Smtp: false,
      About: false,
  });

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
    if ( name === 'Notice' || name === 'About' || name.startsWith('SMTP') ) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      await updateOption(name, value);
    }
  };

  const updateOption = async (name, value) => {
    if (name.endsWith("Enabled")) {
      value = inputs[name] === 'true' ? 'false' : 'true';
    } else {
      setLoading(loading => ({ ...loading, [name]: true }));
    }
    const res = await API.post('/api/config/name', {
      name,
      value,
    });
    const { code, msg } = res.data;
    if (code === 200) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
      showSuccess("Configuration updated successfully!");
    } else {
      showError(msg);
    }
    setLoading(loading => ({ ...loading, [name]: false }));
  };

  const updateSMTPConfig = async () => {
    setLoading(loading => ({ ...loading, Smtp: true }));
    const SMTPConfig = [
      { name: "SMTPServer", value: inputs.SMTPServer },
      { name: "SMTPPort", value: inputs.SMTPPort },
      { name: "SMTPAccount", value: inputs.SMTPAccount },
      { name: "SMTPToken", value: inputs.SMTPToken },
    ];
    const res = await API.post('/api/config/batch', SMTPConfig);
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess("SMTP configuration updated successfully!");
    } else {
      showError(msg);
    }
    setLoading(loading => ({ ...loading, Smtp: false }));
  }

  return (
    <Stack>
      <Stack>
        <Title order={4}>Notice Setting</Title>
        <Textarea
            resize="vertical"
            name="Notice"
            label="Notice"
            description="This notice will be displayed on the homepage. If you dont want to show notice, just leave it empty."
            value={inputs.Notice}
            placeholder="Enter notice content here, and if you dont want to show notice, just leave it empty."
            onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
        />
        <Button onClick={() => updateOption('Notice', inputs.Notice)} loading={loading.Notice}>Save notice</Button>
      </Stack>
      <Divider/>
      <Stack>
        <Title order={4}>Registration Settings</Title>
        <Group gap="xl">
          <Checkbox
              name='RegisterEnabled'
              label='Allow registration'
              checked={inputs.RegisterEnabled === 'true'}
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.checked })}
          />
          <Checkbox
              name='EmailVerificationEnabled'
              label='Require email verification when registering'
              checked={inputs.EmailVerificationEnabled === 'true'}
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.checked })}
          />
          <Checkbox
              name='PasswordResetEnabled'
              label='Allow password reset'
              checked={inputs.PasswordResetEnabled === 'true'}
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.checked })}
          />
        </Group>
      </Stack>
      <Divider/>
      <Stack>
        <Title order={4}>SMTP Settings</Title>
        <Group justify="space-between" gap="sm">
          <TextInput
              name="SMTPServer"
              label="SMTP Server"
              value={inputs.SMTPServer}
              placeholder="SMTP server address"
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
          />
          <TextInput
              name="SMTPPort"
              label="SMTP Port"
              value={inputs.SMTPPort}
              placeholder="SMTP server port"
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
          />
          <TextInput
              name="SMTPAccount"
              label="SMTP Account"
              value={inputs.SMTPAccount}
              placeholder="SMTP account email"
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
          />
          <TextInput
              name="SMTPToken"
              label="SMTP Token"
              value={inputs.SMTPToken}
              placeholder="SMTP account token or password"
              onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
              />
        </Group>
        <Button onClick={updateSMTPConfig} loading={loading.Smtp}>Save SMTP Configuration</Button>
      </Stack>
      <Divider/>
      <Stack>
        <Title order={4}>About Setting</Title>
        <Textarea
            resize="vertical"
            name="About"
            label="About Content"
            description="This content will be displayed on the about page. Markdown are supported."
            value={inputs.About}
            placeholder="Enter notice content here, and if you dont want to show notice, just leave it empty."
            onChange={e => handleInputChange(e, { name: e.target.name, value: e.target.value })}
        />
        <Button onClick={() => updateOption('About', inputs.About)} loading={loading.About}>Save about</Button>
      </Stack>
    </Stack>
  );

}

export default SystemSetting;