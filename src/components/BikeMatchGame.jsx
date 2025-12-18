import { useState } from 'react';
import { ActionIcon, Card, Title, Text, Button, Stack, Group, Image, Box} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useDroppable, DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { CSS } from '@dnd-kit/utilities';

const total = 20
const riders = ["Alex","Andrew","Anna","Apple","Ben Law","Ben Lin","Conor","Constance","David M","David K", "Hardy","Jarrett","Josh","Katie","Nick","Sarah","Sten","Tim","Vignesh","Wenbo"];
const entryIds = {
  "bike-01": "entry.2118217753",
  "bike-02": "entry.1022906453",
  "bike-03": "entry.2002542155",
  "bike-04": "entry.1353524928",
  "bike-05": "entry.1026362817",
  "bike-06": "entry.1938923205",
  "bike-07": "entry.233943155",
  "bike-08": "entry.103502268",
  "bike-09": "entry.307750344",
  "bike-10": "entry.1073742931",
  "bike-11": "entry.814067202",
  "bike-12": "entry.707373730",
  "bike-13": "entry.1112364681",
  "bike-14": "entry.1527542696",
  "bike-15": "entry.2144502645",
  "bike-16": "entry.1257218392",
  "bike-17": "entry.455800163",
  "bike-18": "entry.1418443655",
  "bike-19": "entry.1502225423",
  "bike-20": "entry.2066368981",
};

const solution = [ "Josh", "Ben Lin", "David M", "Katie", "Andrew", "Ben Law", "Anna", "Apple", "Alex", "Wenbo", "Jarrett", "Sten", "Sarah", "Vignesh", "Hardy", "Constance", "Conor", "Tim", "Nick", "David K"]


function toGoogleQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join("");
}

const submitToGoogleForm = async (url, data) => {
  console.log("form data: ", data)
  const query = toGoogleQueryString(data);
  console.log(query);
  url = `${url}?&submit=Submit?usp=pp_url${query}`
  console.log(url);
  await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
  console.log('Submitted to Google Form');
};

export default function BikeMatchGame({ user, locked, onSubmit }) {
  const [ridersList, setRidersList] = useState(
    riders.map((name) => ({
      id: name,
      label: name,
      locked: false,
    }))
  );
  const sortableIds = ridersList
    .filter((r) => !r.locked)
    .map((r) => r.id);

  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(null);
  const [opened, { open, close }] = useDisclosure();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function toggleRiderLock(id) {
    setRidersList((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, locked: !r.locked } : r
      )
    );
  }

  function SortableName({ id, rider }) {
    const locked = false;
    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({ id, disabled: locked });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: locked ? "not-allowed" : "grab",
      opacity: locked ? 0.5 : 1,
    };

    return (
      <Card
        ref={setNodeRef}
        p="xs"
        mt="xs"
        withBorder
        style={{
          ...style,
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: "2px",
          borderColor: locked ? "#999" : "#444",
          margin: 8,
        }}
        {...(!locked ? attributes : {})}
        {...(!locked ? listeners : {})}
      >
        <Text size="lg" weight={800}>
          {id}
        </Text>

        <ActionIcon
          variant="subtle"
          onClick={() => toggleRiderLock(id)}
        >
          {locked ? <IconLock size={20} /> : <IconLockOpen size={20} />}
        </ActionIcon>
      </Card>
    );
  }
  function LockedName({ key, id, rider }) {
    return (
      <Card
        p="xs"
        mt="xs"
        withBorder
        style={{
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: "2px",
          margin: 8,
          opacity: 0.6,
          cursor: "not-allowed",
        }}
      >
        <Text size="lg" weight={800}>
          {id}
        </Text>
        <ActionIcon
          variant="subtle"
          onClick={() => toggleRiderLock(id)}
        >
          {rider.locked ? <IconLock size={20} /> : <IconLockOpen size={20} />}
        </ActionIcon>
      </Card>
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRidersList((prev) => {
      const locked = [];
      const unlocked = [];

      prev.forEach((item, index) => {
        item.locked
          ? locked.push({ index, item })
          : unlocked.push(item);
      });

      const from = unlocked.findIndex((i) => i.id === active.id);
      const to = unlocked.findIndex((i) => i.id === over.id);

      const reordered = [...unlocked];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);

      const result = [...prev];
      let cursor = 0;

      for (let i = 0; i < result.length; i++) {
        if (!locked.some((l) => l.index === i)) {
          result[i] = reordered[cursor++];
        }
      }

      return result;
    });
  }

  function handleSubmit() {
    const formData = {};
    ridersList.forEach((rider, i) => {
      const bikeKey = `bike-${String(i + 1).padStart(2, "0")}`;
      formData[entryIds[bikeKey]] = rider.label;
    });
    formData["entry.465261784"] = user.name; // user name
    submitToGoogleForm('https://docs.google.com/forms/d/e/1FAIpQLSe1-00GxyO8mNZRAM2UPoWDet4DN6zlO71d2om9-Fh3rm-wug/formResponse', formData);
    setIsLocked(true);
    let score = 0;
    console.log("Scoring... ", ridersList, " vs. ", solution)
    for (let i = 0; i < total; i++) {
      if (ridersList[i].id === solution[i]) {
        score++;
      }
    }
    setScore(score);
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
            alignItems: "center"
          }}
        >
          <Box style={{ opacity:1, textAlign: "center", backgroundColor: "gold", borderRadius: "10px"}}>
            <Title size="xl" weight={600}>Congratulations!</Title>
            <Title size="lg" style={{ marginTop: "50px",marginLeft: "10px", marginRight: "10px" }}>
              You could match {score}/{total} TBD riders with their bikes!
            </Title>
            <Button 
              variant="outline" 
              style={{ marginTop: "50px", marginBottom: "50px",marginLeft: "100px", marginRight: "100px"}} 
              onClick={() => {
                setScore(null);
                close();
              }} 
            >Close</Button>
          </Box>
        </div>
      )}
      <Title style={{marginLeft: "20px", marginRight: "20px" }} order={1}>Match the Bike to the Owner</Title>
      <Text size="sm" mb="sm" style={{marginLeft: "20px", marginRight: "20px" }}>
        Drag the names on the right to reorder according to the bikes on the left.
        When you're ready, press the submit button. 
        You can only submit once! Once you submit, you will no longer be able to reorder your choice.
      </Text>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Group grow mt="md" align="flex-start" direction="row" spacing="md">
          <div style={{ display: 'flex', padding: "0 8", marginTop: 16, gap: 16, alignItems: 'flex-start' }}>
            <Stack style={{ flex: 1 }}>
              {[...Array(total).keys()].map((i) => (
                <Card key={`bike-${i}`} p="s" mt="xs" withBorder
                  style={{minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin:8, opacity: isLocked ? 0.6 : 1}}>
                  <Image
                    src={`${import.meta.env.BASE_URL}/assets/bikes/bike-${String(i+1).padStart(2,'0')}.jpg`}
                    height={100}
                    fit="contain"
                  />
                </Card>
              ))}
            </Stack>
            <Stack style={{ flex: 0.4 , gap:"sm"}}>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={sortableIds}
                  strategy={verticalListSortingStrategy}
                >
                  {ridersList.map((rider) => (
                      <div key={rider.id}>
                      {rider.locked ? (
                        <LockedName
                          id={rider.id}
                          rider={rider}
                        />
                      ) : (
                        <SortableName
                          id={rider.id}
                          rider={rider}
                        />
                      )}
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
            </Stack>
          </div>
        </Group>
      </DndContext>

      <Button disabled={!user.name || isLocked} mt="md" onClick={handleSubmit}>Submit</Button>
    </Card>
  );
}