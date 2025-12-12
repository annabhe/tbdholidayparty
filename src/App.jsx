import { MantineProvider, Container, Stack, Accordion} from '@mantine/core';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BikeMatchGame from './components/BikeMatchGame';
import PosterMatchGame from './components/PosterMatchGame';
// import Superlatives from './components/Superlatives';
// import Game4 from './components/Game4';

export default function App() {
  const [user, setUser] = useState({ name: '' });
  const [gamesUnlocked, setGamesUnlocked] = useState(false);

  // track submissions to hide games
  const [bikeGameDone, setBikeGameDone] = useState(false);
  const [posterGameDone, setPosterGameDone] = useState(false);

  return (
    <MantineProvider
      theme={{
        components: {
          Card: {
            defaultProps: {
              radius: "lg",     // bigger rounded corners
              shadow: "sm",
              withBorder: true,
              padding: "sm",
            },
            styles: (theme) => ({
              root: {
                borderRadius: theme.radius.lg,   // ensures radius applies even if inline styles exist
                borderColor: "#444",
                borderWidth: 2,
                borderStyle: "solid",
                overflow: "hidden",
              },
            }),
          },
        },
      }}
    >
      <Container size="md">
        <Header user={user} setUser={setUser} setGamesUnlocked={setGamesUnlocked} />

        <Accordion 
          multiple
          variant="separated"
          radius="md"
          chevronSize={10}
          styles={(theme) => ({
            root: {
              height: "50px",
              width: "100%",
              margin: "0 auto",
            },
            item: {
              backgroundColor: theme.colors.dark[6],
              borderColor: theme.colors.dark[4],
            },
            control: {
              padding: "12px 16px",
            }
          })}
        >
            {/* Bike Match Game */}
            {!bikeGameDone && (
              <Accordion.Item value="match-bike">
                <Accordion.Control disabled={!gamesUnlocked}>
                  Match the Rider to the Bike
                </Accordion.Control>
                <Accordion.Panel>
                  <BikeMatchGame
                    user={user}
                    locked={!gamesUnlocked}
                    onSubmit={() => setBikeGameDone(true)}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Poster Match Game */}
            {!posterGameDone && (
              <Accordion.Item value="match-poster">
                <Accordion.Control disabled={!gamesUnlocked}>
                  Match the Selfie to the Poster
                </Accordion.Control>
                <Accordion.Panel>
                  <PosterMatchGame
                    user={user}
                    locked={!gamesUnlocked}
                    onSubmit={() => setPosterGameDone(true)}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            {/* Superlatives – ALWAYS visible */}
            <Accordion.Item value="superlatives">
              <Accordion.Control>
                Superlatives! See categories
              </Accordion.Control>
              <Accordion.Panel>
                {/* <Superlatives user={user} /> */}<p>TODO:</p>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

        {/* <Footer /> */}
      </Container>
    </MantineProvider>
  );
}