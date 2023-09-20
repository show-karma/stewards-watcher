import { NumberIsh } from './votes';

export interface ISubscanSearchResponse {
  code: number;
  message: string;
  generated_at: number;
  data: {
    account: {
      account_display: {
        address: string;
      };
      address: string;
      assets_tag: null;
      balance: number;
      balance_lock: number;
      bonded: NumberIsh;
      conviction_lock: NumberIsh;
      count_extrinsic: number;
      delegate: {
        conviction_delegate: {
          account: {
            address: string;
          };
          amount: NumberIsh;
          conviction: NumberIsh;
          delegate_account: {
            address: string;
            display: string;
            identity: boolean;
            judgements: [
              {
                index: number;
                judgement: string;
              }
            ];
          };
          origins: NumberIsh;
        }[];

        conviction_delegated: [
          {
            account: {
              address: string;
            };
            amount: NumberIsh;
            conviction: NumberIsh;
            delegate_account: {
              address: string;
            };
            origins: NumberIsh;
          }
        ];
      };
      democracy_lock: NumberIsh;
      election_lock: NumberIsh;
      evm_account: string;
      is_council_member: boolean;
      is_erc20: boolean;
      is_erc721: boolean;
      is_evm_contract: boolean;
      is_fellowship_member: boolean;
      is_module_account: boolean;
      is_registrar: boolean;
      is_techcomm_member: boolean;
      lock: NumberIsh;
      registrar_info: null;
      reserved: NumberIsh;
      substrate_account: {
        address: string;
      };
    };
  };
}
