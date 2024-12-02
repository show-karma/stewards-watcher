import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'system',
};

export const theme = extendTheme({
  config,
  components: {
    Button: {
      defaultProps: {
        variant: 'solid',
      },
      variants: {
        solid: {
          _hover: {
            opacity: 0.75,
          },
          _active: {
            opacity: 0.7,
          },
          _focus: {
            opacity: 0.6,
          },
          _focusVisible: {
            opacity: 0.6,
          },
          _focusWithin: {
            opacity: 0.6,
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {},
      },
    },
  },
  colors: {},
  styles: {
    global: () => ({
      body: {
        '&::-webkit-scrollbar': {
          width: '8px',
          marginX: '4px',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
          bgColor: 'gray.500',
        },
      },
    }),
  },
  fonts: {
    heading: `"Open Sans", sans-serif`,
    body: `"Poppins", sans-serif`,
  },
});
