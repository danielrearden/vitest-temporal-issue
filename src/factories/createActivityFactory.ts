import { ActivityContext } from '../types';

export const createActivityFactory = <
  T extends (...args: any[]) => Promise<any>
>(
  activityFactory: (context: ActivityContext) => T
): ((context: ActivityContext) => T) => {
  return (context) => {
    return (async (...args: any[]) => {
      // there's additional work we do here (e.g. to setup Sentry)
      // but that's not relevant to this issue
      return await activityFactory(context)(...args);
    }) as any;
  };
};
