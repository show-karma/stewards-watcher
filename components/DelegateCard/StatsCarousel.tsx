import { FlexProps } from '@chakra-ui/react';
import {
  Carousel,
  CarouselItem,
  ItemCarouselProps,
} from 'components/Carousels';

export const StatsCarousel = ({
  items,
  controlStyle,
  flexProps,
}: ItemCarouselProps & { flexProps?: FlexProps }) => (
  <Carousel
    items={items}
    controlStyle={controlStyle}
    renderItem={({ item, isSnapPoint }) => (
      <CarouselItem
        key={item.id}
        isSnapPoint={isSnapPoint}
        flexProps={{
          width: ['full'],
          height: ['max-content'],
          ...flexProps,
        }}
      >
        {item.component}
      </CarouselItem>
    )}
  />
);
