import { Text, Tooltip } from '@chakra-ui/react';

export const MonthNotFinishedTooltip = () => (
  <Tooltip
    placement="top"
    label="Admin is finalizing the scores"
    hasArrow
    bgColor="white"
    color="rgba(0,0,0,0.7)"
    fontWeight="normal"
    fontSize="sm"
    borderRadius={10}
    p="3"
  >
    <Text as="span">-</Text>
  </Tooltip>
);
