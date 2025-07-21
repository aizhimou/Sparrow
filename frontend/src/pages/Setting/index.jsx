import React, { useContext, useEffect } from 'react';
import {Center, Container, Stack, Tabs, Title} from "@mantine/core";
import UserSetting from "../../components/UserSetting.jsx";
import SystemSetting from "../../components/SystemSetting.jsx";

const Setting = () => {

  return (
      <Container size="lg" mt="lg">
        <Tabs defaultValue='systemSetting'>
          <Tabs.List>
            <Tabs.Tab value="systemSetting">System Setting</Tabs.Tab>
            <Tabs.Tab value="userSetting">User Setting</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="systemSetting">
            <Stack mt="md">
              <SystemSetting/>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="userSetting">
            <UserSetting/>
          </Tabs.Panel>
        </Tabs>
      </Container>
  );
};

export default Setting;
