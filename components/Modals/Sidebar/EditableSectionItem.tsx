import { ComponentWithAs, Flex, Text, Icon } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { IconBaseProps, IconType } from 'react-icons';

interface ISectionItem {
  icon?: IconType | ComponentWithAs<'svg', IconBaseProps>;
  isEditMode: boolean;
  value: any;
  isSelected: boolean;
  selectItem: (item: any) => void;
  label?: string;
}

export const EditableSectionItem: FC<ISectionItem> = ({
  icon,
  isEditMode,
  value,
  isSelected,
  selectItem,
  label,
}) => {
  const { theme, daoInfo } = useDAO();

  return (
    <Flex
      flexDir="row"
      gap="2"
      borderColor={
        isSelected && isEditMode
          ? theme.modal.statement.sidebar.item.text
          : theme.modal.statement.sidebar.item.border
      }
      bgColor={
        isSelected && isEditMode
          ? theme.modal.statement.sidebar.item.text
          : 'none'
      }
      borderWidth="1px"
      borderRadius="30px"
      borderStyle="solid"
      w="max-content"
      align="center"
      px="3"
      py="3"
      cursor={isEditMode ? 'pointer' : 'unset'}
      onClick={isEditMode ? () => selectItem(value) : undefined}
      userSelect="none"
    >
      {icon && (
        <Icon as={icon} color={theme.modal.statement.sidebar.item.border} />
      )}

      {daoInfo.config.TRACKS_DICTIONARY &&
      daoInfo.config.TRACKS_DICTIONARY[label || value] ? (
        <Text fontSize="xs">
          {daoInfo.config.TRACKS_DICTIONARY[label || value].emoji}
        </Text>
      ) : undefined}

      <Text
        fontSize="xs"
        color={
          isSelected && isEditMode
            ? theme.modal.background
            : theme.modal.statement.sidebar.item.text
        }
        fontWeight="medium"
      >
        {label || value}
      </Text>
    </Flex>
  );
};
