import { Table, Text } from '@chakra-ui/react';
import { IBalanceOverview } from 'types';

interface IBalanceOverviewDisplay {
  data: IBalanceOverview;
}
export const BalanceOverviewDisplay: React.FC<IBalanceOverviewDisplay> = ({
  data,
}) => (
  <div style={{ padding: '10px' }}>
    <Text as="h4" textAlign="center">
      Balance Overview
    </Text>
    <Table
      background="white"
      boxShadow="0 0 10px rgba(0,0,0,0.1)"
      fontWeight="light"
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
        <td>Free:</td>
        <td>
          <b>{Number(data.free).toFixed(8)}</b>
        </td>
      </tr>
      <tr>
        <td>Locked:</td>
        <td>
          <b>{Number(data.locked).toFixed(8)}</b>
        </td>
      </tr>
      <tr>
        <td>Reserved:</td>
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
          <b>{(+data.free + +data.locked).toFixed(8)}</b>
        </td>
      </tr>
      <tr>
        <td>
          Available to delegate:
          <br />
          ((free + locked) - fees)
        </td>
        <td>
          <b>{(+data.free + +data.locked - 0.1).toFixed(8)}</b>
        </td>
      </tr>
    </Table>
  </div>
);
