import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { Alert, Container } from '@mantine/core';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [notice, setNotice] = useState('');

  const fetchNotice = async () => {
    const res = await API.get('/api/config/name?name=Notice');
    const { code, msg, data } = res.data;
    if (code === 200) {
      const content = marked.parse(data);
      setNotice(content);
    } else {
      showError(msg);
    }
  };

  useEffect(() => {
    fetchNotice().then();
  }, []);

  return (
    <Container size="lg" mt="lg">
      {notice ? (
        <Alert variant="light" color="blue" title={t('system_notice')} radius="md">
          <div dangerouslySetInnerHTML={{ __html: notice }} />
        </Alert>
      ) : null}
    </Container>
  );
};

export default Home;
