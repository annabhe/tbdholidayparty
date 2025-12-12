import { Card, Text } from '@mantine/core';
export default function Footer() {
return (
    <Card mt="xl" p="md" radius="lg">
        <Text size="sm" style={{marginLeft: "15px", marginRight: "15px", marginBottom: "24px"}}>
            Thanks for joining us for the ride! Can't wait to see you at the next one! 🚴‍♀️
        </Text>
    </Card>
);
}