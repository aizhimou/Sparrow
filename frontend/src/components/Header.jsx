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
  IconInfoCircle, IconLanguage,
  IconLogout2,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import { API, showSuccess } from '../helpers/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User/UserContext.jsx';
import { useTranslation } from 'react-i18next';

function Header() {
  const computedColorScheme = useComputedColorScheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };
  const [state, dispatch] = useContext(UserContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const headerLinks = [
    {
      name: t('header_home'),
      to: '/',
      icon: IconHome,
    },
    {
      name: t('header_user'),
      to: '/user',
      icon: IconUser,
      requireAdmin: true,
    },
    {
      name: t('header_setting'),
      to: '/system-setting',
      icon: IconSettings,
      requireAdmin: true,
    },
    {
      name: t('header_about'),
      to: '/about',
      icon: IconInfoCircle,
    },
  ];

  const renderLinks = () => {
    if (!state.user) return '';
    const role = state.user.role;
    return headerLinks
      .filter((link) => (link.requireAdmin ? role === 'ADMIN' : true))
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

  function changeLanguageWithStorage(lng) {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  }

  async function logout() {
    await API.post('/api/auth/logout');
    dispatch({ type: 'logout' });
    localStorage.removeItem('user');
    showSuccess(t('logout_success'));
    navigate('/login');
  }

  return (
    <Paper shadow="xs" p={5}>
      <Group justify="space-around" m={0}>
        <Group>
          <Group gap="xs" mr={10} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Image src={logo} w={40}></Image>
            <Title order={4}>{t('header_title')}</Title>
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
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate('/user-setting')}
                >
                  {t('header_account')}
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout2 size={14} />} onClick={logout}>
                  {t('header_logout')}
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
          <Menu>
            <Menu.Target>
              <ActionIcon variant="default" size="sm">
                <IconLanguage />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => changeLanguageWithStorage('en')}>{t('header_lang_en')}</Menu.Item>
              <Menu.Item onClick={() => changeLanguageWithStorage('zh')}>{t('header_lang_zh')}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
