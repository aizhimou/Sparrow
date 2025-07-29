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

const User = () => {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const roleMap = { '-1': 'Root', 0: 'Admin', 1: 'User' };

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

  const handleUpgrade = async (userId) => {
    const res = await API.post('/api/user/upgrade', { id: userId });
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('User upgraded successfully');
      fetchUsers().then();
    } else {
      showError(msg);
    }
  };

  const handleDowngrade = async (userId) => {
    const res = await API.post('/api/user/downgrade', { id: userId });
    const { code, msg } = res.data;
    if (code === 200) {
      showSuccess('User downgraded successfully');
      fetchUsers().then();
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
    const roleMap = { Root: -1, Admin: 0, User: 1 };
    const role = roleMap[addUserForm.values.role];
    const user = addUserForm.values;
    user.role = role;
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
          placeholder="Enter username or email to query"
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
        <Button leftSection={<IconSearch size={16} />} onClick={fetchUsers} color="blue">
          Search
        </Button>
        <Button leftSection={<IconPlus size={16} />} onClick={open} color="cyan">
          New User
        </Button>
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
          { accessor: 'username', title: 'Username' },
          { accessor: 'email', title: 'Email' },
          {
            accessor: 'role',
            title: 'Role',
            render: (user) => (
              <Badge
                radius="xs"
                variant="light"
                color={user.role < 0 ? 'red' : user.role === 0 ? 'orange' : 'green'}
              >
                {roleMap[user.role] || 'Unknown'}
              </Badge>
            ),
          },
          {
            accessor: 'status',
            title: 'status',
            render: (user) => (
              <Badge radius="xs" variant="light" color={user.status === 1 ? 'green' : 'gray'}>
                {user.status === 1 ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
          {
            accessor: 'createdAt',
            title: 'Created At',
            render: ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
          },
          {
            accessor: 'actions',
            title: 'Actions',
            textAlign: 'center',
            render: (record) => (
              <Group gap="sm" justify="right" wrap="nowrap">
                <Button
                  size="xs"
                  width={80}
                  variant="outline"
                  color="grape"
                  onClick={() => handleUpgrade(record.id)}
                  disabled={record.status === 0 || record.role < 0}
                >
                  Upgrade
                </Button>
                <Button
                  size="xs"
                  color="violet"
                  variant="outline"
                  width={80}
                  onClick={() => handleDowngrade(record.id)}
                  disabled={record.status === 0 || record.role > 0}
                >
                  Downgrade
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  disabled={record.role < 0}
                  color={record.status === 1 ? 'red' : 'green'}
                  onClick={() => handleToggleStatus(record.id, record.status)}
                  style={{ width: 95 }}
                >
                  {record.status === 1 ? 'Deactivate' : 'Activate'}
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
      <Modal opened={opened} onClose={close} title="Add New User" centered>
        <form onSubmit={addUserForm.onSubmit(handleAddUser)}>
          <TextInput
            mb="md"
            withAsterisk
            label="Username"
            name="username"
            placeholder="Enter username"
            key={addUserForm.key('username')}
            {...addUserForm.getInputProps('username')}
          />
          <TextInput
            mb="md"
            label="Email"
            name="email"
            placeholder="Enter email"
            key={addUserForm.key('email')}
            {...addUserForm.getInputProps('email')}
          />
          <Select
            mb="md"
            withAsterisk
            label="Choose Role"
            name="role"
            placeholder="Pick value"
            key={addUserForm.key('role')}
            {...addUserForm.getInputProps('role')}
            data={['User', 'Admin', 'Root']}
            defaultValue="User"
          />
          <PasswordInput
            mb="md"
            withAsterisk
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            key={addUserForm.key('password')}
            {...addUserForm.getInputProps('password')}
          />
          <PasswordInput
            mb="md"
            withAsterisk
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            key={addUserForm.key('confirmPassword')}
            placeholder="Enter password again"
            {...addUserForm.getInputProps('confirmPassword')}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default User;
