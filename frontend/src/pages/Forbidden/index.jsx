import React from 'react';
import { Title, Center, Mark } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const Forbidden = () => {
  const { t } = useTranslation();
  <Center mt={150}>
    <Title order={1}>
      <Mark>403</Mark> {t('forbidden')}
    </Title>
  </Center>
};

export default Forbidden;
