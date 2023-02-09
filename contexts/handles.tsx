import { useDisclosure } from '@chakra-ui/react';
import React, { useContext, createContext, useMemo } from 'react';

interface IHandlesProps {
  twitterIsOpen: boolean;
  twitterOnClose: () => void;
  twitterOnOpen: () => void;
  forumIsOpen: boolean;
  forumOnClose: () => void;
  forumOnOpen: () => void;
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
  } = useDisclosure();
  const {
    isOpen: forumIsOpen,
    onClose: forumOnClose,
    onOpen: forumOnOpen,
  } = useDisclosure();

  const providerValue = useMemo(
    () => ({
      twitterIsOpen,
      twitterOnClose,
      twitterOnOpen,
      forumIsOpen,
      forumOnClose,
      forumOnOpen,
    }),
    [
      twitterIsOpen,
      twitterOnClose,
      twitterOnOpen,
      forumIsOpen,
      forumOnClose,
      forumOnOpen,
    ]
  );

  return (
    <HandlesContext.Provider value={providerValue}>
      {children}
    </HandlesContext.Provider>
  );
};

export const useHandles = () => useContext(HandlesContext);
