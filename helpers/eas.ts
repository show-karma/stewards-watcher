export const easQueryWithAddress = (schemaUID: string, search?: string) => `
{
  schema(where: {id: "${schemaUID}"}) {
		attestations(where: {
      recipient: {
        contains: "${search || ''}"
      }
    }) {
			id
      attester
      data
      decodedDataJson
      recipient
      revoked
		timeCreated
    }
  }
}
`;
export const easQueryGeneralistic = (schemaUID: string) => `
{
  schema(where: {id: "${schemaUID}"}) {
		attestations {
			id
      attester
      data
      decodedDataJson
      recipient
      revoked
		timeCreated
    }
  }
}
`;
