import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Container,
  Group,
  Input,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import dayjs from 'dayjs';
import { API, showError, showSuccess } from '../../helpers/index.js';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

const User = () => {
  const { t } = useTranslation();
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const fetchUsers = async () => {
    const res = await API.get(`/api/user/list?page=${page}&size=${PAGE_SIZE}&keyword=${keyword}`);
    const { code, msg, data } = res.data;
    if (code === 200) {
      setRecords(data.records);
      setTotal(data.total);
    } else {
      showError(msg);
    }
  };

  const handleToggleStatus = async (userId, status) => {
    const funStatus = status === 1 ? 'forbid' : 'enable'; // Toggle status
    const res = await API.post(`/api/user/${funStatus}`, { id: userId });
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('User status updated successfully');
      fetchUsers().then();
    } else {
      showError(msg);
    }
  };

  const handleAddUser = async () => {
    const user = addUserForm.values;
    const res = await API.post('/api/user/add', user);
    const { code, msg } = res.data;
    if (code === 200) {
      close(); // Close the modal
      addUserForm.reset(); // Reset the form
      showSuccess('User created successfully');
      fetchUsers().then();
    } else {
      showError(msg);
    }
  };

  const addUserForm = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) =>
        value.length < 3 ? 'Username must be at least 3 characters long' : null,
      email: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Invalid email address' : null;
      },
      password: (value) =>
        value.length < 6 ? 'Password must be at least 6 characters long' : null,
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      role: (value) => (value === '' ? 'Role is required' : null),
    },
  });

  useEffect(() => {
    fetchUsers().then();
  }, [page]);

  return (
    <Container size="lg" mt="lg">
      <Group mt="lg">
        <Input
          leftSection={<IconSearch size={16} />}
          placeholder={t('enter_username_or_email')}
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchUsers().then();
            }
          }}
          style={{ flex: 1 }}
        />
        <Button onClick={fetchUsers}>{t('search')}</Button>
        <Button onClick={open}>{t('new_user')}</Button>
      </Group>
      <DataTable
        mt="md"
        verticalSpacing="sm"
        withTableBorder
        minHeight={250}
        records={records}
        columns={[
          {
            accessor: 'index',
            title: '#',
            render: (record, idx) => (page - 1) * PAGE_SIZE + idx + 1,
          },
          {
            title: t('name'),
            accessor: 'username',
          },
          {
            accessor: 'email',
            title: t('email'),
          },
          {
            accessor: 'role',
            title: t('role'),
            textAlign: 'center',
            render: (user) => (
              <Badge radius="xs" variant="light" color={user.role === 'ADMIN' ? 'orange' : 'teal'}>
                {user.role}
              </Badge>
            ),
          },
          {
            title: t('status'),
            accessor: 'status',
            textAlign: 'center',

            render: (user) => (
              <Badge radius="xs" variant="light" color={user.status === 1 ? 'green' : 'gray'}>
                {user.status === 1 ? t('active') : t('inactive')}
              </Badge>
            ),
          },
          {
            accessor: 'createdAt',
            title: t('created_at'),
            render: ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
          },
          {
            accessor: 'actions',
            title: t('actions'),
            textAlign: 'center',
            render: (record) => (
              <Group gap="sm" justify="center" wrap="nowrap">
                <Button
                  size="xs"
                  variant="outline"
                  disabled={record.role < 0}
                  color={record.status === 1 ? 'red' : 'green'}
                  onClick={() => handleToggleStatus(record.id, record.status)}
                  style={{ width: 95 }}
                >
                  {record.status === 1 ? t('deactivate') : t('activate')}
                </Button>
              </Group>
            ),
          },
        ]}
        totalRecords={total}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={setPage}
      />
      <Modal opened={opened} onClose={close} title={t('add_new_user')} centered>
        <form onSubmit={addUserForm.onSubmit(handleAddUser)}>
          <TextInput
            mb="md"
            withAsterisk
            label={t('username')}
            name="username"
            placeholder={t('enter_username')}
            key={addUserForm.key('username')}
            {...addUserForm.getInputProps('username')}
          />
          <TextInput
            mb="md"
            label={t('email')}
            name="email"
            placeholder={t('enter_email')}
            key={addUserForm.key('email')}
            {...addUserForm.getInputProps('email')}
          />
          <Select
            mb="md"
            withAsterisk
            label={t('choose_role')}
            name="role"
            placeholder={t('pick_value')}
            key={addUserForm.key('role')}
            {...addUserForm.getInputProps('role')}
            data={['USER', 'ADMIN']}
            defaultValue="USER"
          />
          <PasswordInput
            mb="md"
            withAsterisk
            label={t('password')}
            name="password"
            type="password"
            placeholder={t('enter_password')}
            key={addUserForm.key('password')}
            {...addUserForm.getInputProps('password')}
          />
          <PasswordInput
            mb="md"
            withAsterisk
            label={t('confirm_password')}
            name="confirmPassword"
            type="password"
            key={addUserForm.key('confirmPassword')}
            placeholder={t('enter_password_again')}
            {...addUserForm.getInputProps('confirmPassword')}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">{t('submit')}</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default User;
