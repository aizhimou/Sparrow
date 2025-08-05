import React, { useEffect, useState } from 'react';
import { Container, Text, Title, Typography } from '@mantine/core';
import { API, showError } from '../../helpers/index.js';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

const About = () => {
  const [about, setAbout] = useState('');
  const { t } = useTranslation();

  const displayAbout = async () => {
    const res = await API.get('/api/config/name?name=About');
    const { code, msg, data } = res.data;
    if (code === 200) {
      const content = marked.parse(data);
      setAbout(content);
    } else {
      showError(msg);
      setAbout(t('about_load_failed'));
    }
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <Container size="lg" mt="lg">
      {about === '' ? (
        <>
          <Title order={4}>{t('header_about')}</Title>
          <Text>{t('about_tip_content')}</Text>
          <Text>{t('about_tip_html_and_md_supported')}</Text>
        </>
      ) : (
        <Container>
          <Typography>
            <div dangerouslySetInnerHTML={{ __html: about }} />
          </Typography>
        </Container>
      )}
    </Container>
  );
};

export default About;
