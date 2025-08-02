import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { Alert, Container } from '@mantine/core';

const Home = () => {
  const [notice, setNotice] = useState('');

  const fetchNotice = async () => {
    const res = await API.get('/api/config/name?name=Notice');
    const { code, msg, data } = res.data;
    if (code === 200) {
      setNotice(data);
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
        <Alert variant="light" color="blue" title="System Notice" radius="md">
          {notice}
        </Alert>
      ) : null}
    </Container>
  );
};

export default Home;
