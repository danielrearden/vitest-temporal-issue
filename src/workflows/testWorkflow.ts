import { proxyActivities } from '@temporalio/workflow'

const { testActivity } = proxyActivities({
  startToCloseTimeout: '5 minute',
})

export const testWorkflow = async (delayMs: number) => {
  await testActivity(delayMs)

  return null
}
