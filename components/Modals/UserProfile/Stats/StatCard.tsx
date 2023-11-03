import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';

interface StatCardProps {
  title: string;
  amount: string;
}
export const StatCard: FC<StatCardProps> = ({ amount, title }) => {
  const { theme } = useDAO();
  return (
    <Flex
      display="flex"
      flexDirection="column"
      gap="1"
      w="140px"
      height="120px"
      border="1px solid white"
      borderRadius="12px"
      px="6"
      py="4"
      alignItems="flex-start"
      justifyContent="flex-end"
      bg="rgba(255, 255, 255, 0.08)"
    >
      <Text
        fontWeight="700"
        fontSize="14px"
        color={theme.modal.statement.sidebar.item.text}
      >
        {title}
      </Text>
      <Text
        fontWeight="700"
        fontSize="24px"
        color={theme.modal.statement.sidebar.item.text}
      >
        {amount}
      </Text>
    </Flex>
  );
};
