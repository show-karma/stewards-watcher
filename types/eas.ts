import { IAttestation } from 'utils';

export type AttestationResponse = {
  data: {
    schema: {
      attestations: IAttestation<string>[];
    };
  };
};
