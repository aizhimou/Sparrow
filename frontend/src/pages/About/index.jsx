import React, {useContext, useEffect, useState} from 'react';
import {Center, Container, Paper, Text, Title} from "@mantine/core";
import {API, removeTrailingSlash, showError} from "../../helpers/index.js";
import {marked} from "marked";

const About = () => {

  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);

  const displayAbout = async () => {
    const res = await API.get('/api/config/name?name=About');
    const {code, msg, data} = res.data;
    if (code === 200) {
      let content = marked.parse(data);
      setAbout(content);
    } else {
      showError(msg);
      setAbout('Loading about content failed...');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
      <Container size="lg" mt="xl">
        {aboutLoaded && about === '' ? (
                <>
                  <Title order={4}>About</Title>
                  <Text>You can write some contents in setting to show in here. HTML
                    and Markdown are supported.</Text>
                </>
            ) :
            <Container>
              <div dangerouslySetInnerHTML={{__html: about}}></div>
            </Container>
        }
      </Container>
  );
};

export default About;
