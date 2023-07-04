import { ComponentWithAs, Flex, Icon, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { IconBaseProps, IconType } from 'react-icons';

interface ISectionItem {
  icon?: IconType | ComponentWithAs<'svg', IconBaseProps>;
  label?: string;
}

export const SectionItem: FC<ISectionItem> = ({ icon, label }) => {
  const { theme, daoInfo } = useDAO();
  return (
    <Flex
      flexDir="row"
      gap="2"
      borderColor={theme.modal.statement.sidebar.item.border}
      bgColor="none"
      borderWidth="1px"
      borderRadius="30px"
      borderStyle="solid"
      w="max-content"
      align="center"
      px="3"
      py="3"
      cursor="unset"
      userSelect="none"
    >
      {icon && (
        <Icon as={icon} color={theme.modal.statement.sidebar.item.border} />
      )}

      {label &&
      daoInfo.config.TRACKS_DICTIONARY &&
      daoInfo.config.TRACKS_DICTIONARY[label] ? (
        <Text fontSize="xs">
          {daoInfo.config.TRACKS_DICTIONARY[label].emoji}
        </Text>
      ) : undefined}
      <Text
        fontSize="xs"
        color={theme.modal.statement.sidebar.item.text}
        fontWeight="medium"
      >
        {label}
      </Text>
    </Flex>
  );
};
