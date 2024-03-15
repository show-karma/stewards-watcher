import { Hex } from 'types';
import { MoonbeamWSC } from './moonbeamwsc';

export async function moonbeamGetBalanceOverview(address: Hex) {
  const client = await MoonbeamWSC.createClient();
  return client.getSubAccount(address, true);
}
