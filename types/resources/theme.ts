export interface IDAOTheme {
  background: string;
  title: string;
  subtitle: string;
  text: string;
  branding: string;
  buttonText: string;
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
