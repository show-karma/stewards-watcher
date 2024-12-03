import { useDisclosure } from '@chakra-ui/react';
import React, { createContext, useContext, useMemo } from 'react';

interface IHandlesProps {
  twitterIsOpen: boolean;
  twitterOnClose: () => void;
  twitterOnOpen: () => void;
  forumIsOpen: boolean;
  forumOnClose: () => void;
  forumOnOpen: () => void;
  twitterOnToggle: () => void;
  forumOnToggle: () => void;
  githubIsOpen: boolean;
  githubOnClose: () => void;
  githubOnOpen: () => void;
  githubOnToggle: () => void;
}

export const HandlesContext = createContext({} as IHandlesProps);

interface IProviderProps {
  children: React.ReactNode;
}

export const HandlesProvider: React.FC<IProviderProps> = ({ children }) => {
  const {
    isOpen: twitterIsOpen,
    onClose: twitterOnClose,
    onOpen: twitterOnOpen,
    onToggle: twitterOnToggle,
  } = useDisclosure();
  const {
    isOpen: forumIsOpen,
    onClose: forumOnClose,
    onOpen: forumOnOpen,
    onToggle: forumOnToggle,
  } = useDisclosure();
  const {
    isOpen: githubIsOpen,
    onClose: githubOnClose,
    onOpen: githubOnOpen,
    onToggle: githubOnToggle,
  } = useDisclosure();

  const providerValue = useMemo(
    () => ({
      twitterIsOpen,
      twitterOnClose,
      twitterOnOpen,
      twitterOnToggle,
      forumIsOpen,
      forumOnClose,
      forumOnOpen,
      forumOnToggle,
      githubIsOpen,
      githubOnClose,
      githubOnOpen,
      githubOnToggle,
    }),
    [
      twitterIsOpen,
      twitterOnClose,
      twitterOnOpen,
      twitterOnToggle,
      forumIsOpen,
      forumOnClose,
      forumOnOpen,
      forumOnToggle,
      githubIsOpen,
      githubOnClose,
      githubOnOpen,
      githubOnToggle,
    ]
  );

  return (
    <HandlesContext.Provider value={providerValue}>
      {children}
    </HandlesContext.Provider>
  );
};

export const useHandles = () => useContext(HandlesContext);
