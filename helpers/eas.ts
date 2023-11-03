export const easQuery = (schemaUID: string, search?: string) => `
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
