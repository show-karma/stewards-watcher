import { Flex, Heading } from '@chakra-ui/react';
import { ChakraLink } from 'components';
import { AdminGuard } from 'components/pages/delegate-compensation/Admin/AdminGuard';
import { MonthDropdown } from 'components/pages/delegate-compensation/MonthDropdown';
import { useDAO } from 'contexts';

export const DelegateCompensationAdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useDAO();

  return (
    <AdminGuard>
      <Flex flexDir="column" w="full" p={5}>
        <Heading mb={10} color={theme.text}>
          Admin Dashboard
        </Heading>
        <Flex
          flexDirection={['column', 'row']}
          justifyContent="flex-start"
          gap="10"
        >
          <Flex flexDirection="column" gap="4" maxW="200px" w="full">
            <MonthDropdown />
            <Flex
              flexDir="column"
              gap={2}
              px="2"
              py="3"
              bgColor={theme.card.background}
              rounded="lg"
            >
              <ChakraLink
                px="4"
                py="3"
                bgColor={theme.card.statBg}
                href="/delegate-compensation/admin"
                rounded="lg"
                color={theme.text}
              >
                Proposals
              </ChakraLink>
              <ChakraLink
                px="4"
                py="3"
                bgColor={theme.card.statBg}
                rounded="lg"
                href="/delegate-compensation/admin/delegate"
                color={theme.text}
              >
                Delegates
              </ChakraLink>
            </Flex>
          </Flex>
          {children}
        </Flex>
      </Flex>
    </AdminGuard>
  );
};
