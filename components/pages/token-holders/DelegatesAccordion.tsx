import { Accordion, Flex } from '@chakra-ui/react';
import { useDAO, useTokenHolders } from 'contexts';
import { useMemo, useState, FC } from 'react';
import { IDelegatingHistories, IDelegationHistoryAPI } from 'types';
import { DelegationCard } from './DelegationCard';

interface IDelegatesAccordionProps {
  holderData: IDelegationHistoryAPI;
}

export const DelegatesAccordion: FC<IDelegatesAccordionProps> = ({
  holderData,
}) => {
  const { theme } = useDAO();
  const { selectedAddressesData } = useTokenHolders();

  const dataArray = holderData.delegatingHistories;

  const lastDelegation = dataArray[0];
  return useMemo(
    () => (
      <Flex
        w="full"
        pl={{ base: '2', lg: '9' }}
        pr={{ base: '2', lg: '5' }}
        pt="7"
      >
        <Accordion w="full" allowMultiple defaultIndex={[0]}>
          <DelegationCard
            userDelegatedTo={{
              address: lastDelegation.toDelegate,
            }}
            userDelegating={{
              address: holderData.publicAddress,
              name: holderData.ensName,
              picture: holderData.profilePicture || '',
              // amountDelegated: addressData.amountDelegated,
            }}
            data={dataArray}
            selectedDelegation={lastDelegation}
          />
        </Accordion>
      </Flex>
    ),
    [selectedAddressesData]
  );
};
