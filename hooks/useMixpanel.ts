import mp, { Mixpanel } from 'mixpanel-browser';
import { useEffect, useState } from 'react';
import { IMixpanelEvent } from 'types';

interface IUseMixpanel {
  //   mixpanel?: Mixpanel;
  mixpanel: {
    reportEvent: (data: IMixpanelEvent) => void;
  };
}

export const useMixpanel = (prefix = 'delegateApp'): IUseMixpanel => {
  const [mixpanel, setMixpanel] = useState<Mixpanel | undefined>();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MIXPANEL_KEY) {
      mp.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY);
      setMixpanel(mp);
    }
  }, []);

  const reportEvent = (data: IMixpanelEvent): Promise<void> =>
    new Promise((resolve, reject) => {
      mixpanel?.track(`${prefix}:${data.event}`, data.properties || {}, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

  return { mixpanel: { reportEvent } };
};
