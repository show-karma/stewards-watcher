import { useColorMode } from '@chakra-ui/react';
import { IDAOTheme } from 'types';

const usePicasso = (theme: { light: IDAOTheme; dark: IDAOTheme }) => {
  const { colorMode } = useColorMode();

  if (!theme.light || !theme.dark) return {} as IDAOTheme;

  return {
    background:
      colorMode === 'light' ? theme.light.background : theme.dark.background,
    bodyBg: colorMode === 'light' ? theme.light.bodyBg : theme.dark.bodyBg,
    bodyShadow:
      colorMode === 'light' ? theme.light.bodyShadow : theme.dark.bodyShadow,
    title: colorMode === 'light' ? theme.light.title : theme.dark.title,
    subtitle:
      colorMode === 'light' ? theme.light.subtitle : theme.dark.subtitle,
    text: colorMode === 'light' ? theme.light.text : theme.dark.text,
    branding:
      colorMode === 'light' ? theme.light.branding : theme.dark.branding,
    buttonText:
      colorMode === 'light' ? theme.light.buttonText : theme.dark.buttonText,
    buttonTextSec:
      colorMode === 'light'
        ? theme.light.buttonTextSec
        : theme.dark.buttonTextSec,
    headerBg:
      colorMode === 'light' ? theme.light.headerBg : theme.dark.headerBg,
    themeIcon:
      colorMode === 'light' ? theme.light.themeIcon : theme.dark.themeIcon,
    gradientBall:
      colorMode === 'light'
        ? theme.light.gradientBall
        : theme.dark.gradientBall,
    hat: {
      text: {
        primary:
          colorMode === 'light'
            ? theme.light.hat.text.primary
            : theme.dark.hat.text.primary,
        secondary:
          colorMode === 'light'
            ? theme.light.hat.text.secondary
            : theme.dark.hat.text.secondary,
      },
    },
    filters: {
      head:
        colorMode === 'light'
          ? theme.light.filters.head
          : theme.dark.filters.head,
      border:
        colorMode === 'light'
          ? theme.light.filters.border
          : theme.dark.filters.border,
      title:
        colorMode === 'light'
          ? theme.light.filters.title
          : theme.dark.filters.title,
      bg:
        colorMode === 'light' ? theme.light.filters.bg : theme.dark.filters.bg,
      listBg:
        colorMode === 'light'
          ? theme.light.filters.listBg
          : theme.dark.filters.listBg,
      listText:
        colorMode === 'light'
          ? theme.light.filters.listText
          : theme.dark.filters.listText,
    },
    card: {
      icon:
        colorMode === 'light' ? theme.light.card.icon : theme.dark.card.icon,
      background:
        colorMode === 'light'
          ? theme.light.card.background
          : theme.dark.card.background,
      featureStatBg:
        colorMode === 'light'
          ? theme.light.card.featureStatBg
          : theme.dark.card.featureStatBg,
      divider:
        colorMode === 'light'
          ? theme.light.card.divider
          : theme.dark.card.divider,
      text: {
        primary:
          colorMode === 'light'
            ? theme.light.card.text.primary
            : theme.dark.card.text.primary,
        secondary:
          colorMode === 'light'
            ? theme.light.card.text.secondary
            : theme.dark.card.text.secondary,
      },
      border:
        colorMode === 'light'
          ? theme.light.card.border
          : theme.dark.card.border,
    },
  };
};

export { usePicasso };
