// eslint-disable-next-line import/no-extraneous-dependencies
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';
import React, { useContext, createContext, useMemo, useState } from 'react';
import { useDelegates } from './delegates';

interface IFilterProps {
  handleSearch: DebouncedFunc<(text: any) => void>;
  isSearchDirty: boolean;
}

export const FilterContext = createContext({} as IFilterProps);

interface ProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<ProviderProps> = ({ children }) => {
  const { selectUserToFind, userToFind } = useDelegates();
  const isSearchDirty = userToFind !== '';

  const handleSearch = debounce(text => {
    selectUserToFind(text);
  }, 250);

  const providerValue = useMemo(
    () => ({
      handleSearch,
      isSearchDirty,
    }),
    [isSearchDirty]
  );

  return (
    <FilterContext.Provider value={providerValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
