import { useState } from "react";
import { TextInput, Button, Group, Title , Text} from "@mantine/core";
import "./Header.css";

export default function Header({ user, setUser, setGamesUnlocked }) {
  const [localName, setLocalName] = useState(user.name || "");

  const handleSubmit = () => {
    setUser((prev) => ({ ...prev, name: localName }));
    setGamesUnlocked(true);
  };

  return (
    <div className="header-container">
      <div className="y2k-spin">
        <Title order={1} className="y2k-title">
          TBD HOLIDAY PARTY 2025
        </Title>
      </div>
      <Text size="md" mb="md" style={{marginLeft: "20px", marginRight: "20px", marginBottom: "24px"}}>
        Welcome to the party where we'll celebrate our year of big miles, big smiles, and big cups of coffee! 
        <br/>
        Enter your name so we know who is scoring how much on the games! 
      </Text>

      {!user.name && (
        <Group mt="lg" justify="center">
          <TextInput
            placeholder="Enter your name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            styles={{ input: { height: 60, fontSize: 24 } }} 
            className="name-input"
          />
          <Button size="md" style={{marginTop:"10px"}} onClick={handleSubmit}>
            Submit
          </Button>
        </Group>
      )}

      {user.name && (
        <Title order={4} mt="md" style={{ color: "red" }}>
          Welcome, {user.name}!
        </Title>
      )}
    </div>
  );
}
