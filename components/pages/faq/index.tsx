import { Flex, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { FC } from 'react';

interface IFAQPage {
  markdown: string;
}

export const FAQPage: FC<IFAQPage> = ({ markdown }) => (
  <Flex
    alignItems="center"
    w={{ base: 'full' }}
    py="8"
    px={{ base: '4', lg: '20' }}
    flexDir="column"
  >
    <Flex
      w={{ base: 'full', '2xl': '1360px' }}
      flexDir="column"
      sx={{
        lineBreak: 'anywhere',
        'ol, ul': {
          marginLeft: '32px',
        },
        // eslint-disable-next-line id-length
        a: {
          color: 'blue.400',
        },
        code: {
          whiteSpace: 'pre-wrap',
          lineBreak: 'anywhere',
        },
      }}
      align="left"
    >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Flex>
  </Flex>
);
