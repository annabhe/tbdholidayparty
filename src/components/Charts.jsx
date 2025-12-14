import { Card, Stack, Title, Image } from "@mantine/core";

/**
 * Charts component (PNG-based, single card)
 * Props:
 *  - charts: Array<{ src: string; title?: string; alt?: string }>
 *
 * Expects PNG files to live in /public (e.g. /charts/route_popularity.png)
 */
export default function Charts({ charts = [] }) {
  return (
    <Stack gap="md">
      <Title order={5}>Some fun charts from the past year! More stats and details to follow during the party.</Title>

      <Card withBorder radius="lg" shadow="sm" p="md" style={{ overflow: "hidden" }}>
        {charts.map((chart) => (
          <Stack key={chart.src} mb="md">
            <Image
              src={chart.src}
              alt={chart.alt || chart.title || "Chart"}
              radius="md"
              fit="contain"
              style={{ width: "100%", height: "auto" }}
            />
          </Stack>
        ))}
      </Card>
    </Stack>
  );
}
