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
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { HiExternalLink } from 'react-icons/hi';
import { getForumActivity } from 'utils/delegate-compensation/getForumActivity';
import { DelegatePeriod } from '../DelegatePeriod';

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClose = () => setIsModalOpen(false);

  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery(
    ['delegate-compensation-forum-activity', delegateInfo?.discourseHandle],
    () =>
      getForumActivity(
        selectedDate?.value.month,
        selectedDate?.value.year,
        delegateInfo?.discourseHandle
      ),
    {
      enabled:
        !!delegateInfo?.discourseHandle &&
        !!selectedDate?.value.year &&
        !!selectedDate?.value.month,
    }
  );

  return (
    <DelegateCompensationAdminLayout>
      <Box w="full">
        <Flex flexDir="column" gap="4">
          <Heading fontSize="xl" fontWeight="bold" color={theme.text} mb="4">
            Forum activity
          </Heading>
        </Flex>
        <DelegatePeriod delegate="block" period />
        {posts?.length ? (
          <Table variant="simple" w="full">
            <Thead w="full">
              <Tr w="full">
                <Th
                  w="50%"
                  minW="50%"
                  borderBottom="1px solid"
                  borderBottomColor={theme.compensation?.card.dropdown}
                >
                  Topic
                </Th>
                <Th
                  w="50%"
                  minW="50%"
                  borderBottom="1px solid"
                  borderBottomColor={theme.compensation?.card.dropdown}
                >
                  Comment
                </Th>
              </Tr>
            </Thead>
            <Tbody w="full">
              {posts?.map((post, index) => {
                const topicLink = `${post.link
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/`;
                return (
                  <Tr key={index} w="full">
                    <Td
                      w="50%"
                      minW="50%"
                      borderBottom="1px solid"
                      borderBottomColor={theme.compensation?.card.dropdown}
                    >
                      <ChakraLink
                        isExternal
                        href={topicLink}
                        w="max-content"
                        color="blue.500"
                        borderBottom="1px solid"
                        borderColor="blue.500"
                        display="flex"
                        flexDir="row"
                        alignItems="center"
                        gap="2"
                        _hover={{
                          textDecoration: 'none',
                          borderColor: 'blue.400',
                        }}
                      >
                        {post.topic}
                      </ChakraLink>
                    </Td>
                    <Td
                      w="50%"
                      minW="50%"
                      borderBottom="1px solid"
                      borderBottomColor={theme.compensation?.card.dropdown}
                    >
                      <Flex flexDir="row" gap="2">
                        <MDPreview
                          source={post.comment}
                          // disallowedElements={['a']}
                          components={{
                            // eslint-disable-next-line id-length, react/no-unstable-nested-components
                            a: ({ children }) => <Text>{children}</Text>,
                          }}
                        />
                        <ChakraLink
                          isExternal
                          href={post.link}
                          color="blue.500"
                          display="flex"
                          flexDir="row"
                          alignItems="center"
                          textDecor="underline"
                          gap="2"
                          _hover={{
                            borderColor: 'blue.300',
                          }}
                          w="max-content"
                          maxW="max-content"
                        >
                          <HiExternalLink />
                        </ChakraLink>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        ) : (
          <Flex py="4">
            <Text>{`This delegate doesn't have forum posts for this period.`}</Text>
          </Flex>
        )}
      </Box>
    </DelegateCompensationAdminLayout>
  );
};
