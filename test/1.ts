import { runWithWorkflowClient } from "./runWithWorkflowClient"

const DELAY = parseInt(process.env.DELAY ?? '500')
const SUITES = parseInt(process.env.SUITES ?? '5')
const TESTS_PER_SUITE = parseInt(process.env.TESTS_PER_SUITE ?? '5')
const SUITE_NUMBER = 1


describe.skipIf(SUITES < SUITE_NUMBER)(String(SUITE_NUMBER), () => {
  test.skipIf(TESTS_PER_SUITE < 1)('1', async () => {
    await runWithWorkflowClient(async ({ client }) => {
      await client.execute('testWorkflow', [DELAY])
    })
  })

  test.skipIf(TESTS_PER_SUITE < 2)('2', async () => {
    await runWithWorkflowClient(async ({ client }) => {
      await client.execute('testWorkflow', [DELAY])
    })
  })

  test.skipIf(TESTS_PER_SUITE < 3)('3', async () => {
    await runWithWorkflowClient(async ({ client }) => {
      await client.execute('testWorkflow', [DELAY])
    })
  })

  test.skipIf(TESTS_PER_SUITE < 4)('4', async () => {
    await runWithWorkflowClient(async ({ client }) => {
      await client.execute('testWorkflow', [DELAY])
    })
  })

  test.skipIf(TESTS_PER_SUITE < 5)('5', async () => {
    await runWithWorkflowClient(async ({ client }) => {
      await client.execute('testWorkflow', [DELAY])
    })
  })
})
