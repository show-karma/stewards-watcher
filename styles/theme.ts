import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { THEME } from 'configs';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
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
  },
  colors: {},
  styles: {
    global: () => ({
      body: {
        '&::-webkit-scrollbar': {
          width: '8px',
          marginX: '4px',
          borderRadius: '8px',
          backgroundColor: THEME.background,
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
          backgroundColor: THEME.branding,
        },
      },
    }),
  },
  fonts: {
    heading: `"Poppins", sans-serif`,
    body: `"Open Sans", sans-serif`,
  },
});
