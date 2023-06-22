import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useMediaQuery,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  ButtonProps,
} from '@chakra-ui/react';
import { ChakraLink } from 'components/ChakraLink';
import { DownChevron } from 'components/Icons';
import { useDAO } from 'contexts';
import { FC } from 'react';

interface INavMenu {
  title: string;
  childrens: {
    title: string;
    path?: string;
    action?: () => void;
    isExternal?: boolean;
  }[];
  accordion?: boolean;
  children?: React.ReactNode;
}

export const NavMenu: FC<INavMenu> = ({
  title,
  childrens,
  accordion,
  children,
}) => {
  const { theme } = useDAO();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const buttonStyle: ButtonProps = {
    bgColor: 'transparent',
    _hover: {
      opacity: '0.6',
    },
    fontWeight: '300',
    fontSize: { base: 'sm', lg: 'md' },
  };
  const mobileStyle: ButtonProps = {
    width: 'full',
    justifyContent: 'flex-start',
    paddingX: '0',
  };

  return isMobile && accordion ? (
    <Accordion allowToggle>
      <AccordionItem border="none">
        <h2>
          <AccordionButton gap="2" px="0" bg="transparent">
            <Text
              textAlign="left"
              fontWeight="600"
              fontSize={{ base: 'sm', lg: 'md' }}
              color={theme.hat.text.primary}
            >
              {title}
            </Text>
            <AccordionIcon color={theme.hat.text.primary} />
          </AccordionButton>
        </h2>
        <AccordionPanel py="0" px="0">
          {childrens.map((child, index) =>
            child.path ? (
              <ChakraLink
                key={+index}
                _hover={{
                  textDecoration: 'none',
                }}
                href={child.path}
                isExternal={child.isExternal}
              >
                <Button
                  {...buttonStyle}
                  {...mobileStyle}
                  paddingX="0"
                  color={theme.hat.text.primary}
                >
                  {child.title}
                </Button>
              </ChakraLink>
            ) : (
              <Button
                key={+index}
                {...buttonStyle}
                {...mobileStyle}
                paddingX="0"
                color={theme.hat.text.primary}
              >
                {child.title}
              </Button>
            )
          )}
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={
          <DownChevron
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="4"
          />
        }
        bg="transparent"
        color={theme.hat.text.primary}
        gap="0"
        fontFamily="heading"
        fontWeight="600"
        textAlign="left"
        fontSize={{ base: 'sm', lg: 'md' }}
        minW="min-content"
        w={{ base: 'full', md: 'max-content' }}
        maxW="full"
        _hover={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
        px={{ base: '1', xl: '4' }}
        py="5"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {title}
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: 'max-content' }}
        maxH={{ base: '64' }}
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            marginX: '4px',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            bgColor: theme.filters.activeBg,
          },
        }}
      >
        {childrens.map((child, index) =>
          child.path ? (
            <ChakraLink
              key={+index}
              _hover={{
                textDecoration: 'none',
              }}
              href={child.path}
              isExternal={child.isExternal}
            >
              <MenuItem {...buttonStyle}>{child.title}</MenuItem>
            </ChakraLink>
          ) : (
            <MenuItem key={+index} onClick={child.action} {...buttonStyle}>
              {child.title}
            </MenuItem>
          )
        )}
        {children}
      </MenuList>
    </Menu>
  );
};
