import { createActivityFactory } from "../factories/createActivityFactory";

export const testActivity = createActivityFactory(({}) => {
  return async (delayMs: number) => {
    await new Promise(resolve => {
      setTimeout(resolve, delayMs);
    })

    return null;
  };
});
