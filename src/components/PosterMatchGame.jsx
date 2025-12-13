import { useState, useEffect } from 'react';
import { Card, Title, Text, Box, Button, Stack, Group, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const total = 14;
const solutions = ['0215', '0308', '0329', '0405', '0503', '0525', '0628', '0726', '0830', '0906', '0928', '1011', '1102', '1206']
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


function SortableSelfie({id, src, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled,});
  const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab', touchAction: 'none', opacity: disabled ? 0.6 : 1,};

  return (
    <Card
      ref={setNodeRef}
      p="xs"
      mt="xs"
      withBorder
      {...(!disabled ? attributes : {})}
      {...(!disabled ? listeners : {})}
      style={{
        ...style,
        minHeight: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#444',
        borderStyle: 'solid',
        margin: 8,
      }}
    >
      <Image src={src} height={150} fit="contain" />
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

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function PosterMatchGame({ user, locked, onSubmit}) {
  const [selfies, setSelfies] = useState(() => shuffle(solutions));
  const [score, setScore] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSelfies((prev) => {
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
    selfies.forEach((selfieId, i) => {
      const posterKey = `poster-${i+1}`;
      formData[entryIds[posterKey]] = selfieId; // submitting poster match
    });
    console.log(formData)

    formData["entry.760520203"] = user.name;
    submitToGoogleForm(
      "https://docs.google.com/forms/d/e/1FAIpQLScrh0_zLIU1edo-tY2-WnekDgObm-ivqUMfnusyV-9iEOpsLg/formResponse",
      formData
    );
    setIsLocked(true);
    let tempScore = 0;
    console.log(selfies)
    for (let i = 0; i < total; i++) {
      if (selfies[i] === solutions[i]) {
        tempScore++;
      }
    }
    console.log(tempScore)
    setScore(tempScore);
    open();
  }

  return (
    <Card mt="xl" p="md" radius="lg" withBorder style={{ textAlign: "center"}}>
      {score !== null && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",  // Semi-transparent background
            zIndex: 10000,  // Overlay on top
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box style={{ opacity:1, textAlign: "center", backgroundColor: "gold", borderRadius: "10px"}}>
            <Title size="xl" weight={600}>Congratulations!</Title>
            <Title size="lg" style={{ marginTop: "50px",marginLeft: "10px", marginRight: "10px" }}>
              You could match {score}/14 TBD rides with the selfies!
            </Title>
            <Button 
              variant="outline" 
              style={{ marginTop: "50px", marginBottom: "50px",marginLeft: "100px", marginRight: "100px"}} 
              onClick={() => {
                setScore(null)
                close()
                // onSubmit();
              }} 
            >Close</Button>
          </Box>
        </div>
      )}
      <Title style={{marginLeft: "20px", marginRight: "20px" }} order={1}>Match the Poster to the Selfie</Title>
      <Text size="sm" mb="sm" style={{marginLeft: "20px", marginRight: "20px", marginBottom: "24px"}}>
        How many of our most memorable rides are you in? 
        How closely are you following the Instagram page?
        Drag selfies on the right to line up with the poster on the left.
        When you're ready, submit once. Once you submit, you will no longer be able to reorder your choice.
      </Text>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Group grow mt="md" align="flex-start" spacing="md">
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: "0 8px" }}>

            <Stack style={{ flex: 1 }}>
              {[...Array(total).keys()].map((i) => (
                <Card key={`poster-${i}`} p="s" mt="xs" withBorder
                  style={{minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', margin:8, opacity: isLocked ? 0.6 : 1}}>
                  <Image
                    src={`${import.meta.env.BASE_URL}/assets/posters/poster-${i+1}.png`}
                    height={150}
                    fit="contain"
                  />
                </Card>
              ))}
            </Stack>
            
            {/* Right: Selfies (sortable, randomized) */}
            <Stack style={{ flex: 1 }}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selfies} strategy={verticalListSortingStrategy}>
                  { selfies.map((selfieId, i) => (
                    <SortableSelfie
                      id={selfieId}
                      key={selfieId}
                      src={`${import.meta.env.BASE_URL}/assets/selfies/${selfieId}.jpg`}
                      disabled={isLocked}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </Stack>

          </div>
        </Group>
      </DndContext>

      <Button disabled={!user.name || isLocked} mt="md" onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}
