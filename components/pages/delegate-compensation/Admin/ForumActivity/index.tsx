/* eslint-disable no-nested-ternary */
import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ChakraLink } from 'components/ChakraLink';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { DelegateCompensationAdminLayout } from 'layouts/delegateCompensationAdmin';
import { TbExternalLink } from 'react-icons/tb';
import { getForumActivity } from 'utils/delegate-compensation/getForumActivity';
import dynamic from 'next/dynamic';
import { DelegatesDropdown } from '../Delegates/DelegatesDropdown';

// eslint-disable-next-line import/no-extraneous-dependencies
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});
export const DelegateCompensationAdminForumActivity = ({
  delegateAddress,
}: {
  delegateAddress: string;
}) => {
  const { delegateInfo } = useDelegateCompensation();
  const { selectedDate } = useDelegateCompensation();
  const { theme } = useDAO();

  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery(
    ['delegate-compensation-forum-activity', delegateInfo?.discourseHandle],
    () =>
      getForumActivity(
        selectedDate?.name,
        selectedDate?.value.year,
        delegateInfo?.discourseHandle
      ),
    {
      enabled:
        !!delegateInfo?.discourseHandle &&
        !!selectedDate?.value.year &&
        !!selectedDate?.name,
    }
  );

  return (
    <DelegateCompensationAdminLayout>
      <Box w="full">
        <Flex flexDir="column" gap="4">
          <Heading fontSize="xl" fontWeight="bold" color={theme.text} mb="4">
            Forum activity of{' '}
            {delegateInfo?.name || delegateInfo?.ensName || delegateAddress} -{' '}
            {selectedDate?.name} {selectedDate?.value.year}
          </Heading>
          <DelegatesDropdown />
        </Flex>
        {posts?.length ? (
          <Table variant="simple" w="full">
            <Thead w="full">
              <Tr w="full">
                <Th w="25%" minW="25%">
                  Comment
                </Th>
                <Th w="max-content">Link</Th>
                <Th w="25%" minW="25%">
                  Topic
                </Th>
                <Th w="25%" minW="25%">
                  Insight
                </Th>
              </Tr>
            </Thead>
            <Tbody w="full">
              {posts?.map((post, index) => (
                <Tr key={index} w="full">
                  <Td w="25%" minW="25%">
                    <MDPreview source={post.comment} />
                  </Td>
                  <Td w="max-content">
                    <ChakraLink
                      isExternal
                      href={post.link}
                      w="max-content"
                      color="blue.500"
                      borderBottom="1px solid"
                      borderColor="blue.500"
                      display="flex"
                      flexDir="row"
                      alignItems="center"
                      gap="2"
                    >
                      Link to post
                      <TbExternalLink />
                    </ChakraLink>
                  </Td>
                  <Td w="25%" minW="25%">
                    <Text w="max-content">{post.topic}</Text>
                  </Td>
                  <Td w="25%" minW="25%">
                    {post.insight}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Flex py="4">
            <Text>{`This delegate doesn't have forum posts.`}</Text>
          </Flex>
        )}
      </Box>
    </DelegateCompensationAdminLayout>
  );
};
