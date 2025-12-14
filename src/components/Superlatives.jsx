import { List, Text, Card} from "@mantine/core";

export default function Superlatives() {
  const categories = [
    "Most likely to drop the group",
    "Most Stylish rider",
    "Most likely to get a flat",
    "Most prepared to fix a flat",
    "Most likely to enter a bike race",
    "Most likely to show up on time",
    "Most likely to be late to the start",
    "Most likely to show up halfway (skipping the start)",
    "Most likely to peel off early",
    "Most weather proof",
    "Biggest spender at a coffee shop",
    "Most likely to forget to start their Strava",
    "Best ride in worst conditions",
    "Most Scenic Ride",
  ];

  return (
    <Card>
      <Text fw={600} mb="sm" style={{marginLeft: "15px", marginRight: "15px", marginBottom: "24px"}}>
        Ruminate on these categories before we vote later!
      </Text>

      <List spacing="xs" size="sm" withPadding>
        {categories.map((cat) => (
          <List.Item key={cat}>{cat}</List.Item>
        ))}
      </List>
    </Card>
  );
}
