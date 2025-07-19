import React, {useContext} from "react";
import {
  Paper,
  ActionIcon,
  Group,
  Image,
  Flex,
  NavLink,
  Title, Avatar, Menu, Text
} from '@mantine/core';
import logo from "../assets/react.svg";
import {
  IconMoon,
  IconSun,
  IconBrandGithub,
  IconHome,
  IconUser,
  IconSettings,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  API, getSystemName,
  showSuccess
} from "../helpers/index.js";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/User/index.jsx";

function Header({isDark, toggleColorScheme}) {

  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const headerLinks = [
    {
      name: 'Home',
      to: '/',
      icon: IconHome,
      login: true,
    },
    {
      name: 'User',
      to: '/user',
      icon: IconUser,
      login: true,
    },
    {
      name: 'Setting',
      to: '/setting',
      icon: IconSettings,
      login: true,
    },
    {
      name: 'About',
      to: '/about',
      icon: IconInfoCircle,
      login: true,
    },
  ];

  const renderLinks = () => {
    return headerLinks.map((link) => {
      if (link.login && !userState.user) return '';
      return (
          <NavLink key={link.name}
            href={link.to}
            label={link.name}
                   style={{
                     color: 'light-dark',
                     fontWeight: '700',}}
            leftSection={<link.icon size={18} style={{ marginRight: -6 }} />}
          />
      );
    });
  };

  async function logout() {
    await API.post('/api/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
      <Paper h={48} shadow="xs" withBorder style={{borderLeft: '0', borderRight: '0', borderTop: '0'}}>
        <Group m='sm' justify="space-between">
          <Group>
            <Group gap="xs" mr={10} ml={10} style={{cursor: 'pointer'}}>
              <Image src={logo} w={30}></Image>
              <Title order={4}>{getSystemName()}</Title>
            </Group>
            <Flex>
              {renderLinks()}
            </Flex>
          </Group>
          <Group mr={10}>
            { userState.user ?
                <Menu mr={10} withArrow>
                  <Menu.Target>
                    <Group gap={0} style={{cursor: 'pointer'}}>
                      <Text fw={600}>
                        { userState.user.username }
                      </Text>
                    </Group>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={logout}>
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu> : <></>
            }
            <ActionIcon variant='default' size='sm' component="a" href="https://github.com/aizhimou/Sparrow" target="_blank">
              <IconBrandGithub />
            </ActionIcon>
            <ActionIcon variant="default" size='sm'>
              {isDark ?
                  <IconSun onClick={toggleColorScheme}/> :
                  <IconMoon onClick={toggleColorScheme}/>
              }
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
  );
}

export default Header;