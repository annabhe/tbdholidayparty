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

        <Accordion>
          {/* Superlatives – ALWAYS visible */}
          <Accordion.Item value="superlatives">
            <Accordion.Control>
              Superlatives! See categories
            </Accordion.Control>
            <Accordion.Panel>
              {/* <Superlatives user={user} /> */}<p>TODO:</p>
            </Accordion.Panel>
          </Accordion.Item>
          {/* Bike Match Game */}
          {!bikeGameDone && (
            <Accordion.Item value="match-bike">
              <Accordion.Control disabled={!gamesUnlocked}>
                Bike Match Game!
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
                Selfie Poster Match Game!
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


          </Accordion>

        <Footer />
      </Container>
    </MantineProvider>
  );
}