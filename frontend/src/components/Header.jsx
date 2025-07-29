import React, { useContext } from 'react';
import {
  ActionIcon,
  Flex,
  Group,
  Image,
  Menu,
  Paper,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import logo from '../assets/sparrow.svg';
import {
  IconBrandGithub,
  IconHome,
  IconInfoCircle,
  IconLogout2,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import { API, showSuccess } from '../helpers/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User/UserContext.jsx';

function Header() {
  const computedColorScheme = useComputedColorScheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const [state, dispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const headerLinks = [
    {
      name: 'Home',
      to: '/',
      icon: IconHome,
      requiredRole: 1,
    },
    {
      name: 'User',
      to: '/user',
      icon: IconUser,
      requiredRole: 0,
    },
    {
      name: 'Setting',
      to: '/systemSetting',
      icon: IconSettings,
      requiredRole: 0,
    },
    {
      name: 'About',
      to: '/about',
      icon: IconInfoCircle,
      requiredRole: 1,
    },
  ];

  const renderLinks = () => {
    if (!state.user) return '';
    const role = state.user.role;
    return headerLinks
      .filter((link) => role <= link.requiredRole)
      .map((link) => (
        <Link to={link.to} key={link.name} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group mr="lg">
            {React.createElement(link.icon, { size: 16 })}
            <Text fw={700} ml="-6">
              {link.name}
            </Text>
          </Group>
        </Link>
      ));
  };

  async function logout() {
    await API.post('/api/auth/logout');
    dispatch({ type: 'logout' });
    localStorage.removeItem('user');
    showSuccess('Logout successful!');
    navigate('/login');
  }

  return (
    <Paper
      h={45}
      shadow="xs"
      withBorder
      style={{ borderLeft: '0', borderRight: '0', borderTop: '0' }}
    >
      <Group m="sm" justify="space-around">
        <Group>
          <Group gap="xs" mr={10} onClick={()=>navigate('/')} style={{ cursor: 'pointer' }}>
            <Image src={logo} w={40}></Image>
            <Title order={4}>Sparrow</Title>
          </Group>
          <Flex>{renderLinks()}</Flex>
        </Group>
        <Group>
          {state.user ? (
            <Menu mr={10} withArrow>
              <Menu.Target>
                <Group gap={0} style={{ cursor: 'pointer' }}>
                  <Text fw={600}>{state.user.username}</Text>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                {state.user.email ? <Menu.Item>{state.user.email}</Menu.Item> : <></>}
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate('/userSetting')}
                >
                  Setting
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout2 size={14} />} onClick={logout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <></>
          )}
          <ActionIcon
            variant="default"
            size="sm"
            component="a"
            href="https://github.com/aizhimou/sparrow"
            target="_blank"
          >
            <IconBrandGithub />
          </ActionIcon>
          <ActionIcon variant="default" size="sm">
            {'dark' === computedColorScheme ? (
              <IconSun onClick={toggleColorScheme} />
            ) : (
              <IconMoon onClick={toggleColorScheme} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}

export default Header;
