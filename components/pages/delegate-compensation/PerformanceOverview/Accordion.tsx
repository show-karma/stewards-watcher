import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { ScoringSystemCarousel } from './Carousel';
import { scoringStats } from './helper';

export const ScoringSystemAccordion = () => {
  const { theme } = useDAO();
  return (
    <Accordion w="full" allowToggle>
      <AccordionItem
        w="full"
        border="none"
        p="3"
        bg={theme.compensation?.performanceOverview.header.bg.card}
        borderRadius="8px"
      >
        <AccordionButton w="full" p="0">
          <Flex
            mb="3"
            as="span"
            flex="1"
            gap="2"
            align="center"
            textAlign="left"
          >
            <Flex
              bg={
                theme.compensation?.performanceOverview.header.bg.scoringSystem
              }
              borderRadius="4px"
              p="1"
              width="32px"
              height="32px"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                alt="Learn how our Scoring System works"
                src="/icons/delegate-compensation/brain.png"
                width="24px"
                height="24px"
              />
            </Flex>
            <Text
              fontSize={{ base: '14px' }}
              fontWeight={600}
              color={theme.compensation?.performanceOverview.header.text}
            >
              Learn how our Scoring System works
            </Text>
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p="0" pb={4}>
          <ScoringSystemCarousel
            items={scoringStats.map((scoringStat, index) => ({
              id: scoringStat.title,
              component: (
                <Flex
                  key={scoringStat.title}
                  p="3"
                  w="full"
                  style={{
                    border: `1px solid ${theme.compensation?.card.divider}`,
                  }}
                  borderRadius="8px"
                  m="0.5"
                >
                  <Flex flexDir="column" gap="4" flex="1">
                    <Flex
                      alignItems={['flex-start']}
                      flexDir={['row']}
                      justifyContent="space-between"
                      gap="4"
                    >
                      <Image
                        alt={scoringStat.title}
                        src={scoringStat.iconUrl}
                        width="40px"
                        height="40px"
                        style={{
                          minWidth: '40px',
                          minHeight: '40px',
                          width: '40px',
                          height: '40px',
                          maxWidth: '40px',
                          maxHeight: '40px',
                        }}
                      />
                      {scoringStat.weight ? (
                        <Flex
                          flexDir="row"
                          gap="2"
                          bg={theme.compensation?.modal.emphasisBg}
                          px="2"
                          py="1"
                          borderRadius="4px"
                        >
                          <Text
                            fontSize="14px"
                            fontWeight="700"
                            color={theme.compensation?.modal.emphasis}
                          >
                            {scoringStat.weight}%
                          </Text>
                          <Text
                            fontSize="14px"
                            fontWeight="500"
                            color={theme.compensation?.modal.emphasis}
                          >
                            Weight in Score
                          </Text>
                        </Flex>
                      ) : null}
                    </Flex>
                    <Flex flexDir="column" gap="0">
                      <Text
                        fontSize="16px"
                        fontWeight="600"
                        color={theme.compensation?.card.text}
                      >
                        {scoringStat.title}
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight={400}
                        color={theme.compensation?.card.text}
                      >
                        {scoringStat.description}
                      </Text>
                    </Flex>
                    <Flex
                      flexDir="column"
                      gap="0"
                      bg={theme.compensation?.modal.block}
                      borderRadius="8px"
                      p="3"
                    >
                      <Flex flexDir="row" gap="3" alignItems="center">
                        <Text
                          fontSize="14px"
                          fontWeight="700"
                          color={theme.compensation?.card.text}
                        >
                          How it’s Calculated
                        </Text>
                      </Flex>
                      <Flex flexDir="row" gap="1" alignItems="center">
                        <Text
                          fontSize="14px"
                          fontWeight={700}
                          color={theme.compensation?.card.text}
                          w="full"
                          maxW="max-content"
                        >
                          {scoringStat.abbreviation} =
                          <Text
                            ml="1"
                            as="span"
                            fontSize="14px"
                            fontWeight={500}
                            color={theme.compensation?.card.text}
                          >
                            {scoringStat.formula}
                          </Text>
                        </Text>
                      </Flex>
                      {scoringStat.updatedIn ? (
                        <Text
                          fontSize="12px"
                          fontWeight="700"
                          color={theme.compensation?.modal.emphasis}
                        >
                          Updated Formula in {scoringStat.updatedIn}
                        </Text>
                      ) : null}
                    </Flex>
                  </Flex>
                </Flex>
              ),
            }))}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
