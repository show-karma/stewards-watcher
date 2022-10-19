import { useColorMode } from '@chakra-ui/react';
import { IDAOTheme } from 'types';

const usePicasso = (theme: { light: IDAOTheme; dark: IDAOTheme }) => {
  const { colorMode } = useColorMode();

  if (!theme.light || !theme.dark) return {} as IDAOTheme;

  return colorMode === 'light' ? theme.light : theme.dark;
};

export { usePicasso };
