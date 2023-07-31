import { Icon, IconProps } from '@chakra-ui/react';
import { GoCommentDiscussion } from 'react-icons/go';

export const ThreadIcon = (props: IconProps) => (
  <Icon as={GoCommentDiscussion} {...props} />
);
