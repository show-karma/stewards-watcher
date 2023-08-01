import { UseToastOptions } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { IDAOInfo } from 'types';

export const handleError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  daoInfo: IDAOInfo,
  toast: Dispatch<SetStateAction<UseToastOptions>>
) => {
  if (error.data?.message?.includes('message: ')) {
    // regex to get what is between Some(" and ")
    const regex = /(?<=Some\(")(.*)(?="\))/gm;
    const message = error.data.message.match(regex)[0];
    if (!message) {
      toast({
        title: 'Delegation failed',
        description: `Transaction failed.`,
        status: 'error',
      });
      return;
    }
    const dictionary = daoInfo.config.DELEGATION_ERRORS_DICTIONARY;
    if (dictionary && dictionary[message]) {
      toast({
        title: 'Delegation failed',
        description: `${dictionary[message]}`,
        status: 'error',
      });
      return;
    }
    // regex to remove camelcase to spaces and capitalize first letter of first word
    const regex2 = /([A-Z])/g;
    const messageFormatted = message.replace(regex2, ' $1');

    toast({
      title: 'Delegation failed',
      description: `${messageFormatted} 22`,
      status: 'error',
    });
  } else if (
    error.stack?.includes('code=ACTION_REJECTED') ||
    error.stack?.includes('code=4001') ||
    error.message.includes('User rejected')
  ) {
    toast({
      title: 'Error',
      description: 'The transaction was cancelled. Please try again.',
      status: 'error',
    });
  } else {
    toast({
      title: 'Delegation failed',
      description: `Transaction failed.`,
      status: 'error',
    });
  }
};
