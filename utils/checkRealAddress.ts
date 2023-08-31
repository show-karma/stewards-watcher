import { api, API_ROUTES } from 'helpers';

export const checkRealAddress = async (address: string) => {
  if (!address) return undefined;
  try {
    const response = await api.get(API_ROUTES.USER.GET_USER(address));
    const { address: addressReturn } = response.data.data;
    return addressReturn;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
