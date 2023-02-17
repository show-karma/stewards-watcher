/* eslint-disable @next/next/no-img-element */
import {
  Flex,
  Text,
  IconButton,
  Icon,
  Link,
  Button,
  ButtonProps,
} from '@chakra-ui/react';
import { DiscordIcon, TwitterIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { KARMA_LINKS } from 'helpers';
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { IDelegate } from 'types';

interface StepProps {
  handleModal: () => void;
  delegatedUser: IDelegate;
}

const buttonWithoutStyle: ButtonProps = {
  height: 'max-content',
  _hover: {},
  _active: {},
  _focus: {},
  _focusVisible: {},
  _focusWithin: {},
};

export const Step2: React.FC<StepProps> = ({ handleModal, delegatedUser }) => {
  const { daoData } = useDAO();
  const name = daoData?.name;
  const twitter = daoData?.socialLinks.twitter;

  return (
    <Flex
      flexDir="column"
      width="max-content"
      minW="450px"
      height="max-content"
      backgroundColor="white"
      padding="24px 32px"
      borderRadius="6px"
    >
      <Flex
        display="flex"
        flexDirection="row"
        gap="100px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontStyle="normal"
          fontWeight="700"
          fontSize="20px"
          color="#000000"
          width="100%"
        >
          Delegate
        </Text>
        <IconButton
          bgColor="transparent"
          aria-label="close"
          onClick={handleModal}
          color="gray.500"
        >
          <Icon as={IoClose} boxSize="6" />
        </IconButton>
      </Flex>
      <Flex
        fontWeight="500"
        fontSize="14px"
        color="#687785"
        marginBottom="32px"
        flexDir="column"
      >
        <Text
          fontWeight="500"
          fontSize="14px"
          lineHeight="17px"
          color="#687785"
          marginBottom="32px"
        >
          You’ve successfully delegated your votes
        </Text>
        <Flex display="flex" flexDirection="column" gap="12px" my="4">
          <Link
            href={`https://twitter.com/intent/tweet?text=I%20just%20delegated%20my%20${
              twitter ? `%40${twitter.split('twitter.com/')[1]}` : name
            }%20tokens%20to%20${
              delegatedUser.twitterHandle
                ? `%40${delegatedUser.twitterHandle}`
                : delegatedUser.ensName || delegatedUser.address
            }%0Ahttps%3A%2F%2F${window.location.hostname}%2Fprofile%2F${
              delegatedUser.ensName || delegatedUser.address
            }`}
            isExternal
            textDecoration={{}}
            _hover={{}}
          >
            <Button
              {...buttonWithoutStyle}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              padding="20px 24px"
              background="rgba(86, 173, 244, 0.14)"
              border="none"
              borderRadius="6px"
              alignItems="center"
              cursor="pointer"
              width="100%"
              color="#56adf4"
            >
              <Text color="56adf4">Share on Twitter</Text>
              <TwitterIcon color="#56adf4" boxSize="24px" />
            </Button>
          </Link>
          <Link
            href={KARMA_LINKS.discord}
            isExternal
            textDecoration={{}}
            _hover={{}}
          >
            <Button
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              padding="20px 24px"
              background="rgba(86, 173, 244, 0.14)"
              border="none"
              borderRadius="6px"
              alignItems="center"
              cursor="pointer"
              width="100%"
              color="#536dfe"
              {...buttonWithoutStyle}
            >
              <Text>Join Karma Discord</Text>
              <DiscordIcon boxSize="24px" />
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Button
        onClick={handleModal}
        fontStyle="normal"
        fontWeight="700"
        fontSize="16px"
        color="#000000"
        background="none"
        border="2px solid #000000"
        boxSizing="border-box"
        borderRadius="6px"
        width="100%"
        padding="12px 0"
        textTransform="none"
        _disabled={{
          border: '2px solid #adb8c0',
          backgroundColor: '#adb8c0',
          cursor: 'not-allowed',
          color: 'white',
        }}
        _hover={{}}
        _active={{}}
        _focus={{}}
        _focusVisible={{}}
        _focusWithin={{}}
      >
        Done
      </Button>
    </Flex>
  );
};
