import {
  Carousel,
  CarouselItem,
  ItemCarouselProps,
} from 'components/Carousels';

export const StatsCarousel = ({ items, controlStyle }: ItemCarouselProps) => (
  <Carousel
    items={items}
    controlStyle={controlStyle}
    renderItem={({ item, isSnapPoint }) => (
      <CarouselItem
        key={item.id}
        isSnapPoint={isSnapPoint}
        flexProps={{
          width: ['full'],
          height: ['310px'],
        }}
      >
        {item.component}
      </CarouselItem>
    )}
  />
);
