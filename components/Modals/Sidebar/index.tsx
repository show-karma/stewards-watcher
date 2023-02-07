import { Flex, Text } from '@chakra-ui/react';
import { useDAO, useEditStatement } from 'contexts';
import { FC, ReactNode } from 'react';
import { ICustomFields } from 'types';
import { EditableSectionItem } from './EditableSectionItem';

const SectionHeader: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useDAO();
  return (
    <Text color={theme.modal.statement.sidebar.section} fontWeight="semibold">
      {children}
    </Text>
  );
};

interface ISidebar {
  interests: ICustomFields;
  isEditMode: boolean;
}

export const Sidebar: FC<ISidebar> = ({ interests, isEditMode }) => {
  const { isEditing, defaultInterests, editInterests, newInterests } =
    useEditStatement();
  const interestsValueArray = Array.isArray(interests.value)
    ? (interests.value as string[])
    : interests.value.split(',');

  return (
    <Flex w={{ base: 'full', lg: '16.875rem' }}>
      <Flex flexDir="column" gap="10" w="full">
        <Flex flexDir="column" gap="5">
          {((interests && interestsValueArray.length > 0) || isEditing) && (
            <SectionHeader>Interests</SectionHeader>
          )}
          <Flex columnGap="1" rowGap="2" flexWrap="wrap">
            {isEditing
              ? defaultInterests.map((interest, index) => (
                  <EditableSectionItem
                    isEditMode={isEditMode}
                    key={+index}
                    value={interest[0].toUpperCase() + interest.substring(1)}
                    isSelected={newInterests.value.includes(interest)}
                    selectItem={editInterests}
                  />
                ))
              : interestsValueArray.map((interest, index) => (
                  <EditableSectionItem
                    isEditMode={isEditMode}
                    key={+index}
                    value={interest[0].toUpperCase() + interest.substring(1)}
                    isSelected={interestsValueArray.includes(interest)}
                    selectItem={() => undefined}
                  />
                ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
