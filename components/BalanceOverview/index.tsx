/* eslint-disable no-shadow */
import { Table, TableContainer, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { IBalanceOverview } from 'types';

interface IBalanceOverviewDisplay {
  data: IBalanceOverview;
}
export const BalanceOverviewDisplay: React.FC<IBalanceOverviewDisplay> = ({
  data,
}) => {
  const { availableToDelegate } = useMemo(() => {
    const transferrable = +(data.balance || 0) + +data.locked;

    return {
      availableToDelegate: transferrable - 0.1,
    };
  }, [data]);

  return (
    <div style={{ padding: '10px' }}>
      <Text as="h4" textAlign="center">
        Balance Overview
      </Text>
      <TableContainer>
        <Table
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
          fontWeight="light"
          color="white"
          __css={{
            'tr td': {
              padding: '3px 10px ',
            },
            'tr:nth-child(2n)': {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
          }}
        >
          <tr>
            <td>Free balance:</td>
            <td>
              <b>{Number(data.balance).toFixed(8)}</b>
            </td>
          </tr>
          <tr>
            <td>Locked:</td>
            <td>
              <b>{Number(data.locked).toFixed(8)}</b>
            </td>
          </tr>
          <tr>
            <td>Delegated:</td>
            <td>
              <b>{Number(data.reserved).toFixed(8)}</b>
            </td>
          </tr>
          <tr>
            <td>Deducted for fees:</td>
            <td>
              <b>0.1</b>
            </td>
          </tr>
          <tr>
            <td>Total:</td>
            <td>
              <b>{(+data.free + +data.reserved).toFixed(8)}</b>
            </td>
          </tr>
          <tr>
            <td>
              Available to delegate:
              <br />
              <small>(free + locked - fee)</small>
            </td>
            <td>
              <b>{availableToDelegate.toFixed(8)}</b>
            </td>
          </tr>
        </Table>
      </TableContainer>
    </div>
  );
};
