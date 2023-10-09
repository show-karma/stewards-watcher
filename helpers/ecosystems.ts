export const ECOSYSTEMS: Record<
  string,
  {
    name: string;
    icon: string;
    url: string;
  }[]
> = {
  moonbeam: [
    {
      name: 'Moonriver',
      icon: '/daos/moonriver/favicon.png',
      url: 'https://delegate.moonbeam.network/moonriver',
    },
    {
      name: 'Moonbase',
      icon: '/daos/moonbase/favicon.png',
      url: 'https://delegate.moonbeam.network/moonbase',
    },
    {
      name: 'Moonbeam',
      icon: '/daos/moonbeam/favicon.png',
      url: 'https://delegate.moonbeam.network',
    },
  ],
};
