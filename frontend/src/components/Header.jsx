import React, {useContext} from "react";
import {
  Paper,
  ActionIcon,
  Group,
  Image,
  Flex,
  NavLink,
  Title,
  Avatar,
  Menu,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
  Badge
} from '@mantine/core';
import logo from "../assets/sparrow.svg";
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
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/User/index.jsx";
import {IconLogout2} from "@tabler/icons-react";

function Header() {

  const computedColorScheme = useComputedColorScheme();
  const {colorScheme, setColorScheme} = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const headerLinks = [
    {
      name: 'Home',
      to: '/',
      icon: IconHome,
      admin: false,
    },
    {
      name: 'User',
      to: '/user',
      icon: IconUser,
      admin: true,
    },
    {
      name: 'Setting',
      to: '/systemSetting',
      icon: IconSettings,
      admin: true,
    },
    {
      name: 'About',
      to: '/about',
      icon: IconInfoCircle,
      admin: false,
    },
  ];

const renderLinks = () => {
  if (!userState.user) return '';
  const role = userState.user.role;
  return headerLinks
    .filter(link => role <= 0 || (role > 0 && !link.admin))
    .map(link => (
      <Link to={link.to} key={link.name}
            style={{textDecoration: 'none', color: 'inherit'}}>
        <Group mr='lg'>
          {React.createElement(link.icon, {size: 16})}
          <Text fw={700} ml='-6'> {link.name} </Text>
        </Group>
      </Link>
    ));
};

  async function logout() {
    await API.post('/api/auth/logout');
    userDispatch({type: 'logout'});
    localStorage.removeItem('user');
    showSuccess('Logout successful!');
    navigate('/login');
  }

  const toHome = () => {
    navigate("/")
  }

  return (
      <Paper h={40} shadow="xs" withBorder
             style={{borderLeft: '0', borderRight: '0', borderTop: '0'}}>
        <Group m='sm' justify="space-around">
          <Group>
            <Group gap="xs" mr={10} onClick={toHome} style={{cursor: 'pointer'}}>
              <Image src={logo} w={40}></Image>
              <Title order={4}>{getSystemName()}</Title>
            </Group>
            <Flex>
              {renderLinks()}
            </Flex>
          </Group>
          <Group>
            {userState.user ?
                <Menu mr={10} withArrow>
                  <Menu.Target>
                    <Group gap={0} style={{cursor: 'pointer'}}>
                      <Text fw={600}>
                        {userState.user.username}
                      </Text>
                    </Group>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {userState.user.email ?
                        <Menu.Item>{userState.user.email}</Menu.Item>
                    : <></>}
                    <Menu.Item leftSection={<IconSettings size={14} />} onClick={() => navigate('/userSetting')}>
                      Setting
                    </Menu.Item>
                    <Menu.Item leftSection={<IconLogout2 size={14} />} onClick={logout}>
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu> : <></>
            }
            <ActionIcon variant='default' size='sm' component="a"
                        href="https://github.com/aizhimou/Sparrow"
                        target="_blank">
              <IconBrandGithub/>
            </ActionIcon>
            <ActionIcon variant="default" size='sm'>
              {'dark' === computedColorScheme ?
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