import React, { useContext, useEffect } from 'react';
import {
  API,
  showError,
  showNotice,
} from '../../helpers';
import { ConfigContext } from '../../context/Config/index.jsx';
import {Center, Title} from "@mantine/core";
import {UserContext} from "../../context/User/index.jsx";

const Home = () => {
  const [statusState, statusDispatch] = useContext(ConfigContext);
  const [userState] = useContext(UserContext);

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        showNotice(data);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    // displayNotice().then();
  }, []);

  return (
      <Center mt={150}>
        <Title>Home Page</Title>
      </Center>
  );
};

export default Home;
