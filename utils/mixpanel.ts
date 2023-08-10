import mp, { Mixpanel } from 'mixpanel-browser';
import { IMixpanelEvent } from 'types';

let mixpanel: Mixpanel | undefined;
if (
  process.env.NEXT_PUBLIC_MIXPANEL_KEY &&
  process.env.NODE_ENV === 'production'
) {
  mp.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY);
  mixpanel = mp;
}

const reportEvent = (prefix: string, data: IMixpanelEvent): Promise<void> =>
  new Promise((resolve, reject) => {
    mixpanel?.track(`${prefix}:${data.event}`, data.properties || {}, err => {
      if (err && err !== 1) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const MixpanelService = {
  reportEvent,
};

export { MixpanelService };
