import React, { useEffect, useState } from 'react';
import { Container, Text, Title, Typography } from '@mantine/core';
import { API, showError } from '../../helpers/index.js';
import { marked } from 'marked';

const About = () => {
  const [about, setAbout] = useState('');

  const displayAbout = async () => {
    const res = await API.get('/api/config/name?name=About');
    const { code, msg, data } = res.data;
    if (code === 200) {
      const content = marked.parse(data);
      setAbout(content);
    } else {
      showError(msg);
      setAbout('Loading about content failed...');
    }
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <Container size="lg" mt="lg">
      {about === '' ? (
        <>
          <Title order={4}>About</Title>
          <Text>You can write some contents in setting to show in here.</Text>
          <Text>HTML and Markdown are supported.</Text>
        </>
      ) : (
        <Container>
          <Typography>
            <div
                dangerouslySetInnerHTML={{ __html: about }}
            />
          </Typography>
        </Container>
      )}
    </Container>
  );
};

export default About;
