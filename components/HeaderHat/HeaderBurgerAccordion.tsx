import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Icon,
  Img,
  useMediaQuery,
} from '@chakra-ui/react';
import { ChakraLink } from 'components/ChakraLink';
import { BurgerMenuIcon, CloseMenuIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { FC, ReactNode } from 'react';
import { Madeby } from './Madeby';
import { NavMenu } from './NavMenu';

interface IHeaderBurgerAccordionProps {
  children?: ReactNode;
  mountingForTokenholders: () => {
    title: string;
    path?: string;
    action?: () => void;
  }[];
  mountingForDelegates: () => {
    title: string;
    path: string;
  }[];
}

export const HeaderBurgerAccordion: FC<IHeaderBurgerAccordionProps> = ({
  children,
  mountingForTokenholders,
  mountingForDelegates,
}) => {
  const { theme, daoInfo } = useDAO();
  const { config } = daoInfo;
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  return (
    <Accordion
      allowToggle
      w={{ base: 'full' }}
      maxW={{ base: '400px', md: '820px', lg: '944px', xl: '1360px' }}
    >
      <AccordionItem border="none" w="full">
        {({ isExpanded }) => (
          <>
            <Flex align="center" justify="space-between" w="full">
              <Flex
                align={{ base: 'center', sm: 'flex-start' }}
                justify={{ base: 'flex-start', sm: 'center' }}
                gap={{ base: '4', sm: '1' }}
                flexDir={{ base: 'row', sm: 'column' }}
              >
                <ChakraLink href="/">
                  <Img
                    w="auto"
                    maxW="36"
                    h="10"
                    objectFit="contain"
                    src={config.DAO_LOGO}
                  />
                </ChakraLink>
                <Madeby />
              </Flex>
              {isMobile ? null : (
                <Flex>
                  <NavMenu
                    title="For Tokenholders"
                    childrens={mountingForTokenholders()}
                  />
                  <NavMenu
                    title="For Delegates"
                    childrens={mountingForDelegates()}
                  />
                </Flex>
              )}
              <AccordionButton _hover={{}} w="max-content">
                <Button
                  bg="none"
                  _hover={{}}
                  _active={{}}
                  _focus={{}}
                  _focusWithin={{}}
                  _focusVisible={{}}
                  color={theme.hat.text.primary}
                >
                  <Icon
                    as={isExpanded ? CloseMenuIcon : BurgerMenuIcon}
                    boxSize="6"
                  />
                </Button>
              </AccordionButton>
            </Flex>
            <AccordionPanel width="full" p={0} mt="8" mb="4">
              {children}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};
