import React, { useContext, createContext, useMemo, useState } from 'react';
import { supportedDAOs } from 'resources';
import { IDAOInfo } from 'types';

interface IDAOProps {
  daoInfo: IDAOInfo;
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
    }),
    [daoInfo]
  );

  return (
    <DAOContext.Provider value={providerValue}>{children}</DAOContext.Provider>
  );
};

export const useDAO = () => useContext(DAOContext);
