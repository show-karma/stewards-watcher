import { usePicasso } from 'hooks';
import React, { useContext, createContext, useMemo, useState } from 'react';
import { supportedDAOs } from 'resources';
import { IDAOInfo, IDAOTheme } from 'types';

interface IDAOProps {
  daoInfo: IDAOInfo;
  theme: IDAOTheme;
}

export const DAOContext = createContext({} as IDAOProps);

interface ProviderProps {
  selectedDAO: string;
  children: React.ReactNode;
}

export const DAOProvider: React.FC<ProviderProps> = ({
  children,
  selectedDAO,
}) => {
  const [daoInfo, setDAOInfo] = useState<IDAOInfo>({} as IDAOInfo);
  const theme = usePicasso({ light: daoInfo.light, dark: daoInfo.dark });

  const searchConfig = (dao: string) => {
    const findDAO = supportedDAOs[dao];
    if (!findDAO) setDAOInfo({} as IDAOInfo);
    setDAOInfo(findDAO);
  };

  useMemo(() => {
    searchConfig(selectedDAO);
  }, [selectedDAO]);

  const providerValue = useMemo(
    () => ({
      daoInfo,
      theme,
    }),
    [daoInfo, theme]
  );

  return (
    <DAOContext.Provider value={providerValue}>{children}</DAOContext.Provider>
  );
};

export const useDAO = () => useContext(DAOContext);
