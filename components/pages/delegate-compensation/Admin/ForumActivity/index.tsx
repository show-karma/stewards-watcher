/* eslint-disable no-nested-ternary */
import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import { TbExternalLink } from 'react-icons/tb';
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
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const onOpen = () => setIsModalOpen(true);
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
      {isModalOpen ? (
        <Modal isOpen={isModalOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent rounded="lg">
            <ModalHeader
              bg={theme.modal.background}
              textColor={theme.modal.statement.headline}
            >
              {selectedPost?.topic}
            </ModalHeader>
            <ModalCloseButton textColor={theme.modal.statement.headline} />
            <ModalBody
              bg={theme.modal.background}
              textColor={theme.modal.statement.text}
              maxH="80vh"
              overflowY="auto"
            >
              <MDPreview source={selectedPost?.comment || ''} />
              <Flex
                flexDir="row"
                gap="2"
                alignItems="center"
                borderBottom="1px solid"
                borderColor="blue.500"
                w="max-content"
                mt="8"
              >
                <ChakraLink
                  isExternal
                  href={selectedPost?.link}
                  color="blue.500"
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  gap="2"
                  _hover={{
                    textDecoration: 'none',
                    borderColor: 'blue.400',
                  }}
                >
                  <Text fontWeight="bold" color="blue.500">
                    Link to post
                  </Text>
                  <TbExternalLink />
                </ChakraLink>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
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
                    <Box
                      w="full"
                      maxW="full"
                      onClick={() => {
                        onOpen();
                        setSelectedPost(post);
                      }}
                      cursor="pointer"
                      color="blue.500"
                      textDecoration="underline"
                      userSelect="none"
                    >
                      <MDPreview
                        source={post.comment.split('\n').slice(0, 4).join('\n')}
                        // disallowedElements={['a']}
                        components={{
                          // eslint-disable-next-line id-length, react/no-unstable-nested-components
                          a: ({ children }) => <Text>{children}</Text>,
                        }}
                      />
                    </Box>
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
                      _hover={{
                        textDecoration: 'none',
                        borderColor: 'blue.400',
                      }}
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
            <Text>{`This delegate doesn't have forum posts for this period.`}</Text>
          </Flex>
        )}
      </Box>
    </DelegateCompensationAdminLayout>
  );
};
