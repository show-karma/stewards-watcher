import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { THEME } from 'configs';
import { useStewards } from 'contexts';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { IFilterStat } from 'types';

interface IStatOptions {
  title: string;
  stat: IFilterStat;
}

const statOptions: IStatOptions[] = [
  { title: 'Forum Activity', stat: 'forumScore' },
  { title: 'User Address', stat: 'user' },
  { title: 'Voting weight', stat: 'delegatedVotes' },
  { title: 'Off-chain votes', stat: 'offChainVotesPct' },
  { title: 'On-chain votes', stat: 'onChainVotesPct' },
];

export const StatFilter = () => {
  const { stat, selectStat } = useStewards();

  const selectedStat = statOptions.find(option => option.stat === stat)?.title;
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<HiChevronDown />}
        bgColor={THEME.background}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
      >
        {selectedStat}
      </MenuButton>
      <MenuList>
        {statOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectStat(option.stat)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
