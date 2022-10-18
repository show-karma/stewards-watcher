export interface IDAOTheme {
  background: string;
  title: string;
  subtitle: string;
  text: string;
  branding: string;
  buttonText: string;
  headerBg: string;
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
