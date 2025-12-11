import { useState, useEffect } from 'react';
import { Card, Title, Text, Button, Stack, Group, Image } from '@mantine/core';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const total = 14;
solutions = ['0215', '0308', '0329', '0405', '0503', '0525', '0628', '0726', '0830', '0906', '0928', '1011', '1102', '1206']
//  "name": "entry.760520203",
const entryIds = {
  "poster-1": "entry.675552282",
  "poster-2": "entry.1676186981",
  "poster-3": "entry.1539321607",
  "poster-4": "entry.231554743",
  "poster-5": "entry.776554790",
  "poster-6": "entry.1695363852",
  "poster-7": "entry.1752985508",
  "poster-8": "entry.1164609167",
  "poster-9": "entry.2074270814",
  "poster-10": "entry.466784067",
  "poster-11": "entry.1961256151",
  "poster-12": "entry.596565629",
  "poster-13": "entry.1822611895",
  "poster-14": "entry.415017047",
};


function SortableSelfie({id, src }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab', touchAction: 'none' };

  return (
    <Card
      ref={setNodeRef}
      p="xs"
      mt="xs"
      withBorder
      {...attributes}
      {...listeners}
      style={{
        ...style,
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#444',
        borderStyle: 'solid',
        margin: 16,
      }}
    >
      <Image src={src} height={100} fit="contain" />
    </Card>
  );
}


function toGoogleQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join("");
}

const submitToGoogleForm = async (url, data) => {
  const query = toGoogleQueryString(data);
  url = `${url}?&submit=Submit?usp=pp_url${query}`;
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  console.log("Submitted to Google Form");
};


export default function PosterMatchGame({ user }) {
  const [locked, setLocked] = useState(false);
  const [selfies, setSelfies] = useState([]);

  const [posterOrder, setPosterOrder] = useState(
    Array.from({ length: total }, (_, i) => `poster-${i + 1}`)
  );

  useEffect(() => {
    const randomSelfies = solutions;
    randomSelfies.sort(() => Math.random() - 0.5);
    setSelfies(randomSelfies);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );


  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPosterOrder((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      const newArray = [...prev];
      newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, active.id);
      return newArray;
    });
  }


  function handleSubmit() {
    const formData = {};

    // map selfie[i] → poster at posterOrder[i]
    posterOrder.forEach((posterId, i) => {
      const pairKey = `pair-${String(i + 1).padStart(2, "0")}`;
      formData[entryIds[pairKey]] = posterId; // submitting poster match
    });

    formData["entry.760520203"] = user.name;
    submitToGoogleForm(
      "https://docs.google.com/forms/d/e/1FAIpQLScrh0_zLIU1edo-tY2-WnekDgObm-ivqUMfnusyV-9iEOpsLg/formResponse",
      formData
    );

    setLocked(true);
  }

  return (
    <Card mt="xl" p="md" radius="lg" withBorder opacity={locked ? 0.4 : 1}>
      <Title order={1}>Match the Poster to the Selfie</Title>
      <Text size="sm" mb="sm">
        Drag selfies on the right to line up with the poster on the left.
        When you're ready, submit once.
      </Text>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Group grow mt="md" align="flex-start" spacing="md">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: "0 16px" }}>
            
            {/* Left: Posters (static) */}
            <Stack style={{ flex: 1 }}>
              <Title order={5}>Posters</Title>

              {selfies.map((selfieId, i) => (
                <Card
                  key={selfieId}
                  mt="xs"
                  withBorder
                  p="xs"
                  style={{
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 16,
                  }}
                >
                  <Image
                    src={`/assets/selfies/${selfieId}.jpg`}
                    height={100}
                    fit="contain"
                  />
                </Card>
              ))}
            </Stack>

            {/* Right: Selfies (sortable, randomized) */}
            <Stack style={{ flex: 0.6 }}>
              <Title order={5}>Selfies</Title>

              <SortableContext items={posterOrder} strategy={verticalListSortingStrategy}>
                {posterOrder.map((posterId) => (
                  <SortableSelfie
                    key={posterId}
                    id={posterId}
                    src={`/assets/posters/${posterId}.png`}
                  />
                ))}
              </SortableContext>
            </Stack>
          </div>
        </Group>
      </DndContext>

      <Button disabled={!user.name || locked} mt="md" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}
