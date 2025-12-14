import { MantineProvider, Container, Accordion} from '@mantine/core';
import { useState } from 'react';
import Header from './components/Header';
import SelfieCarousel from './components/SelfieCarousel';
import Footer from './components/Footer';
import BikeMatchGame from './components/BikeMatchGame';
import PosterMatchGame from './components/PosterMatchGame';
import Superlatives from './components/Superlatives';
import Charts from './components/Charts';

export default function App() {
  const [user, setUser] = useState({ name: '' });
  const [gamesUnlocked, setGamesUnlocked] = useState(false);

  // track submissions to hide games
  const [bikeGameDone, setBikeGameDone] = useState(false);
  const [posterGameDone, setPosterGameDone] = useState(false);

  const charts = [
    {
      title: "Route Popularity",
      src: `${import.meta.env.BASE_URL}/assets/charts/route_popularity_pie_2025.png`,
    },
    {
      title: "Route Popularity",
      src: `${import.meta.env.BASE_URL}/assets/charts/coffee_sunburst_2025.png`,
    },
    {
      title: "Route Popularity",
      src: `${import.meta.env.BASE_URL}/assets/charts/start_sunburst_2025.png`,
    },
  ]

  return (
    <MantineProvider
      theme={{
        components: {
          Card: {
            defaultProps: {
              radius: "lg",     // bigger rounded corners
              shadow: "sm",
              padding: "sm",
              withBorder: true,
            },
            styles: (theme) => ({
              root: {
                borderRadius: theme.radius.md,   // ensures radius applies even if inline styles exist
                borderColor: "#BB2528",
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
        <SelfieCarousel />
        <Accordion 
          variant="contained"
          styles={{
            item: {
              borderColor: "#BB2528",
            },
            control: {
              color: "#BB2528",
            },
            chevron: {
              color: "#BB2528",
            },
          }}
        >
          {/* Superlatives – ALWAYS visible */}
          <Accordion.Item value="superlatives">
            <Accordion.Control>
              Superlatives! See categories
            </Accordion.Control>
            <Accordion.Panel>
              <Superlatives user={user} />
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
          <Accordion.Item value="charts">
            <Accordion.Control>
              TBD Facts and Figures
            </Accordion.Control>
            <Accordion.Panel>
              <Charts charts={charts} />
            </Accordion.Panel>
          </Accordion.Item> 
          </Accordion>
        <Footer />
      </Container>
    </MantineProvider>
  );
}