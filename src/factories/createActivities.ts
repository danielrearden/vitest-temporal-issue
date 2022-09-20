// eslint-disable-next-line import/no-namespace
import * as Activities from '../activities';
import { ActivityContext } from '../types';

export const createActivities = (context: ActivityContext) => {
  return Object.fromEntries(
    Object.entries(Activities).map((entry) => {
      return [entry[0], entry[1](context)];
    })
  ) as {
    [Key in keyof typeof Activities]: ReturnType<typeof Activities[Key]>;
  };
};
