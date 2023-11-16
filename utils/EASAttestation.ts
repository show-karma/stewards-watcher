/* eslint-disable no-underscore-dangle */
export interface IAttestation<T = unknown> {
  id: string;
  attester: string;
  data: string;
  decodedDataJson: T;
  recipient: string;
  revoked: boolean;
  profilePictureUrl?: string;
  timeCreated: number;
}

export interface AttestationSchema {
  tokenChainId: number;
  tokenAddress: string;
  daoName: string;
  goodGovCitizen: boolean;
}

export interface EndorseDelegateSchema {
  endorse: number;
  comment?: string;
  tokenAddress: string | string[];
  tokenChainId: number;
}

export class EASAttestation<T = unknown> implements IAttestation<T> {
  readonly id: string;

  private _name = '';

  public profilePictureUrl: string | undefined;

  readonly attester: string;

  readonly recipient: string;

  readonly revoked: boolean;

  private readonly _data: string;

  private _decodedDataJson: T;

  public readonly timeCreated: number;

  constructor({
    attester,
    data,
    decodedDataJson,
    recipient,
    revoked,
    timeCreated,
    id,
  }: IAttestation & { decodedDataJson: string }) {
    this.id = id;
    this._decodedDataJson = EASAttestation.parseJsonData<T>(decodedDataJson);
    this.attester = attester;
    this._data = data;
    this.recipient = recipient;
    this.revoked = revoked;
    this.timeCreated = timeCreated;
  }

  static parseJsonData<R>(decodedDataJson: string): R {
    const parsedJson = JSON.parse(decodedDataJson);
    if (Array.isArray(parsedJson)) {
      return parsedJson.reduce((acc, curr) => {
        acc[curr.value.name] = curr.value.value;
        return acc;
      }, {});
    }
    throw new Error('Invalid JSON data');
  }

  get decodedDataJson() {
    return this._decodedDataJson;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get data() {
    return this._data;
  }
}
