import { Image, Box } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

const selfieImages = [
'/assets/selfies/0104.jpg',
'/assets/selfies/0118.jpg',
'/assets/selfies/0201.jpg',
'/assets/selfies/0215.jpg',
'/assets/selfies/0222.jpg',
'/assets/selfies/0301.jpg',
'/assets/selfies/0308.jpg',
'/assets/selfies/0315.jpg',
'/assets/selfies/0322.jpg',
'/assets/selfies/0329.jpg',
'/assets/selfies/0405-2.jpg',
'/assets/selfies/0405.jpg',
'/assets/selfies/0419.jpg',
'/assets/selfies/0426.jpg',
'/assets/selfies/0503.jpg',
'/assets/selfies/0510.jpg',
'/assets/selfies/0517.jpg',
'/assets/selfies/0525-2.jpg',
'/assets/selfies/0525.jpg',
'/assets/selfies/0531.jpg',
'/assets/selfies/0607.jpg',
'/assets/selfies/0621.jpg',
'/assets/selfies/0628.jpg',
'/assets/selfies/0705.jpg',
'/assets/selfies/0712.jpg',
'/assets/selfies/0719.jpg',
'/assets/selfies/0726.jpg',
'/assets/selfies/0802.jpg',
'/assets/selfies/0809.JPG',
'/assets/selfies/0816.jpeg',
'/assets/selfies/0823.jpeg',
'/assets/selfies/0830.jpg',
'/assets/selfies/0906.jpg',
'/assets/selfies/0913.jpg',
'/assets/selfies/0920.jpg',
'/assets/selfies/0928.jpg',
'/assets/selfies/1004.jpg',
'/assets/selfies/1011.jpg',
'/assets/selfies/1018-1.jpg',
'/assets/selfies/1018-2.jpg',
'/assets/selfies/1025.jpg',
'/assets/selfies/1101.jpg',
'/assets/selfies/1102.jpg',
'/assets/selfies/1108.jpg',
'/assets/selfies/1115.jpg',
'/assets/selfies/1206.jpg',
'/assets/selfies/HP_0812.jpg',
'/assets/selfies/HP_0819.jpg',
'/assets/selfies/HP_0826.jpg',
'/assets/selfies/picnic.jpg',
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function SelfieCarousel() {
  return (
      <Carousel
        withIndicators
        height={250}
        loop
        align="center"
      >
        {shuffleArray(selfieImages).map((src, idx) => (
          <Carousel.Slide key={idx}>
            <Image
              src={`${import.meta.env.BASE_URL}${src}`}
              radius="md"
              height={180}
              alt={`Selfie ${idx + 1}`}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
  );
}
