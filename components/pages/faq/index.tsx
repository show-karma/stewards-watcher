import { Flex, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { FC } from 'react';

interface IFAQPage {
  markdown: string;
}

export const FAQPage: FC<IFAQPage> = ({ markdown }) => {
  //   const { markdownPath } = props;
  console.log(markdown);

  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};
