import React, {useContext, useEffect, useState} from 'react';
import {
  API,
  showError,
  showNotice,
} from '../../helpers';
import {ConfigContext} from '../../context/Config/index.jsx';
import {Alert, Center, Group, Container, Title} from "@mantine/core";
import {UserContext} from "../../context/User/index.jsx";
import {Heatmap} from "@mantine/charts";

const Home = () => {
  const [notice, setNotice] = useState("");
  const [dates, setDates] = useState([]);

  const fetchNotice = async () => {
    const res = await API.get('/api/config/name?name=Notice');
    const {code, msg, data} = res.data;
    if (code === 200) {
      setNotice(data);
    } else {
      showError(msg);
    }
  };

  useEffect(() => {
    fetchNotice().then();
  }, []);

  return (
      <Container size="lg" mt="lg">
        {notice ?
            <Alert variant="light" color="blue" title="System Notice"
                   radius="md">
              {notice}
            </Alert> : null}
      </Container>
  );
};

export default Home;
