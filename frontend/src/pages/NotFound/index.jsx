import React from 'react';
import { Center, Mark, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Center mt={150}>
      <Title order={1}>
        <Mark>404</Mark> {t('not_found')}
      </Title>
    </Center>
  );
};

export default NotFound;
