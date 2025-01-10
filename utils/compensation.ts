interface ICompensationDates {
  daos: string[];
  daosOldVersion: string[];
  compensationDates: Record<
    string,
    {
      OLD_VERSION_MIN?: Date;
      OLD_VERSION_MAX?: Date;
      NEW_VERSION_MIN: Date;
      NEW_VERSION_MAX: Date;
    }
  >;
}

export const compensation: ICompensationDates = {
  daos: ['arbitrum', 'zksync'],
  daosOldVersion: ['arbitrum'],
  compensationDates: {
    arbitrum: {
      OLD_VERSION_MIN: new Date('2024-02-11'),
      OLD_VERSION_MAX: new Date('2024-10-10'),
      NEW_VERSION_MIN: new Date('2024-10-11'),
      NEW_VERSION_MAX: new Date('2024-12-10'),
    },
    zksync: {
      NEW_VERSION_MIN: new Date('2024-12-31'),
      NEW_VERSION_MAX: new Date(),
    },
  },
};
