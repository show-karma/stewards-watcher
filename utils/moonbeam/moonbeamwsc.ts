import { ApiPromise, WsProvider } from '@polkadot/api';
import { QueryableModuleConsts } from '@polkadot/api/types';
import startCase from 'lodash.startcase';
import { MoonbeamProposal, MoonbeamTrack, MoonbeamTrackRes } from 'types';

/**
 * MoonbeamWSC is a wrapper around the Moonbeam node's API
 * It is used to get information about the Moonbeam node's state
 * and to get information about the Moonbeam DAO
 * @param client - The Moonbeam node's API
 * @returns An instance of MoonbeamWSC
 *
 * @example
 */
export class MoonbeamWSC {
  private client: ApiPromise;

  // eslint-disable-next-line no-use-before-define
  private static instance: MoonbeamWSC;

  constructor(client: ApiPromise) {
    this.client = client;
  }

  /**
   * Create a new instance of the Moonbeam client
   * @param destroy - If true, disconnect from the Moonbeam node.
   * Note that if you want to use the client again, you will need to create a new instance
   */
  getTracks(destroy?: boolean): MoonbeamTrack[] {
    // eslint-disable-next-line prefer-destructuring
    const tracks: QueryableModuleConsts[string] =
      this.client.consts.referenda.tracks;
    if (destroy) this.destroy();
    const tracksArr: MoonbeamTrackRes[] = tracks.toJSON() as MoonbeamTrackRes[];

    return tracksArr.map(([id, track]) => ({
      ...track,
      displayName: startCase(track.name),
      id,
    }));
  }

  /**
   * Get all proposals from the Moonbeam node
   * @param destroy - If true, disconnect from the Moonbeam node.
   * Note that if you want to use the client again, you will need to create a new instance
   */
  async getProposals(destroy?: boolean): Promise<MoonbeamProposal[]> {
    const entries =
      await this.client.query.referenda.referendumInfoFor.entries();
    const proposals: MoonbeamProposal[] = [];
    entries.forEach(([keys, exposure]) => {
      proposals.push({
        proposalId: keys.args
          .map((key: { toJSON: () => any }) => key.toJSON())
          .join(', '),
        information: exposure.toJSON() as MoonbeamProposal['information'],
      });
    });
    if (destroy) this.destroy();
    return proposals;
  }

  /**
   * Disconnect from the Moonbeam node
   */
  async destroy() {
    await this.client.disconnect();
  }

  /**
   * Create a new MoonbeamWSC instance
   * - If an instance already exists, return it
   * - If not, create a new instance and return it
   */
  static async createClient(
    wsProvider?: `wss://${string}`
  ): Promise<MoonbeamWSC> {
    if (this.instance) return this.instance;

    const provider = new WsProvider(
      wsProvider || 'wss://wss.api.moonriver.moonbeam.network'
    );
    const cli = await ApiPromise.create({ provider });
    return new this(cli);
  }
}
