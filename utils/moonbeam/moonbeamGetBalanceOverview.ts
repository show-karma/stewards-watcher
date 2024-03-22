import { Hex, IBalanceOverview } from 'types';
import { MoonbeamWSC } from './moonbeamwsc';

export async function moonbeamGetBalanceOverview(
  address: Hex,
  wss: `wss://${string}`
): Promise<IBalanceOverview> {
  const client = await MoonbeamWSC.createClient(wss);
  const locks = await client.getLockedBalanceOf(address);
  const subaccount = await client.getSubAccount(address, true);

  return {
    balance: '0',
    free: subaccount.free,
    locked: String(locks[1]),
    reserved: subaccount.reserved,
    flags: '0',
  };
}
