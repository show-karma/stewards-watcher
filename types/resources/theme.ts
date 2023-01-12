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
  collapse: {
    bg: string;
    text: string;
    subtext: string;
  };
  hat: {
    text: {
      primary: string;
      secondary: string;
      madeBy: string;
      lastUpdated: string;
    };
  };
  filters: {
    head: string;
    border: string;
    title: string;
    bg: string;
    listBg: string;
    activeBg?: string;
    listText: string;
    shadow?: string;
  };
  card: {
    shadow?: string;
    icon: string;
    background: string;
    statBg: string;
    divider: string;
    text: {
      primary: string;
      secondary: string;
    };
    border: string;
    common: string;
  };
  modal: {
    background: string;
    header: {
      border: string;
      title: string;
      subtitle: string;
      twitter: string;
      divider: string;
    };
    buttons: {
      selectBg: string;
      selectText: string;
      navBg: string;
      navText: string;
      navUnselectedText: string;
      navBorder: string;
    };
    statement: {
      headline: string;
      text: string;
      sidebar: {
        section: string;
        subsection: string;
        text: string;
        item: {
          bg: string;
          text: string;
          border: string;
        };
      };
    };
    votingHistory: {
      headline: string;
      divider: string;
      proposal: {
        title: string;
        type: string;
        date: string;
        result: string;
        verticalDivider: string;
        divider: string;
        icons: {
          for: string;
          against: string;
          abstain: string;
          notVoted: string;
          multiple: string;
        };
      };
      reason: {
        title: string;
        text: string;
        divider: string;
      };
      navigation: {
        color: string;
        buttons: {
          selectedBg: string;
          selectedText: string;
          unSelectedBg: string;
          unSelectedText: string;
        };
      };
    };
    delegateTo: {
      bg: string;
      userBg: string;
      userShadow: string;
      topBg: string;
      text: string;
      subtext: string;
      input: {
        placeholder: string;
        text: string;
        dirtyBorder: string;
        border: string;
        error: string;
        bg: string;
      };
      button: {
        disabled: {
          bg: string;
          text: string;
        };
        normal: {
          bg: string;
          text: string;
        };
        alternative: {
          bg: string;
          text: string;
          border: string;
        };
      };
    };
  };
}
