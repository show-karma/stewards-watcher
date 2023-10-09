import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Link,
  Img,
  useMediaQuery,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';

export const EcosystemAccordion: FC = () => {
  const { theme, daoInfo } = useDAO();
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  return isMobile ? (
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
              Ecosystem
            </Text>
            <AccordionIcon color={theme.hat.text.primary} />
          </AccordionButton>
        </h2>
        <AccordionPanel py="0" px="0" gap="4">
          {daoInfo.config.ECOSYSTEM?.map((item, index) => (
            <Link
              isExternal
              href={item.url}
              display="flex"
              gap="2"
              flexDirection="row"
              color={theme.hat.text.primary}
              alignItems="center"
              justifyContent="flex-start"
              key={+index}
              bg="transparent"
              _hover={{ opacity: 0.8 }}
              fontSize={{ base: 'sm', lg: 'md' }}
              py="2"
            >
              <Img
                src={item.icon}
                w="4"
                h="4"
                alt={item.name}
                objectFit="cover"
              />
              {item.name}
            </Link>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : null;
};
