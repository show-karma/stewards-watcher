import { Flex } from '@chakra-ui/react';
import { FC } from 'react';

interface IGradientBall {
  background?: string;
  width?: string;
  height?: string;
  top?: string;
  right?: string;
  opacity?: string;
  blur?: string;
}

export const GradientBall: FC<IGradientBall> = ({
  background = 'white',
  width = '550px',
  height = '550px',
  top = '-84px',
  right = '0px',
  opacity = '0.15',
  blur = '200px',
}) => (
  <Flex
    position="absolute"
    background={background}
    width={width}
    height={height}
    top={top}
    right={right}
    opacity={opacity}
    filter={`blur(${blur})`}
    zIndex="2"
  />
);
