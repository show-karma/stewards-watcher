export interface IDAOTheme {
  background: string;
  bodyBg: string;
  bodyShadow?: string;
  title: string;
  subtitle: string;
  text: string;
  branding: string;
  buttonText: string;
  buttonTextSec: string;
  headerBg: string;
  gradientBall: string;
  themeIcon: string;
  hat: {
    text: {
      primary: string;
      secondary: string;
    };
  };
  filters: {
    head: string;
    border: string;
    title: string;
    bg: string;
    listBg: string;
    listText: string;
    shadow?: string;
  };
  card: {
    shadow?: string;
    icon: string;
    background: string;
    featureStatBg: string;
    divider: string;
    text: {
      primary: string;
      secondary: string;
    };
    border: string;
  };
}
