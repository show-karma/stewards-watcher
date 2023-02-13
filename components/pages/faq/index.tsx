import { Flex, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { FC } from 'react';

interface IFAQPage {
  markdown: string;
}

export const FAQPage: FC<IFAQPage> = ({ markdown }) => (
  <Flex
    flexDir="column"
    align="left"
    w="full"
    py="8"
    sx={{
      'ol, ul': {
        marginLeft: '32px',
      },
      // eslint-disable-next-line id-length
      a: {
        color: 'blue.400',
      },
    }}
  >
    <ReactMarkdown>{markdown}</ReactMarkdown>
  </Flex>
);
