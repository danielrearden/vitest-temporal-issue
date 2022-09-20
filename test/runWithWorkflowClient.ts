import path from 'node:path';
import {
  type WorkflowHandleWithRunId,
  Connection,
  WorkflowClient,
} from '@temporalio/client';
import {
  type WorkflowBundleWithSourceMap,
  bundleWorkflowCode,
  Worker,
} from '@temporalio/worker';
import { v4 as createUuid } from 'uuid';
import { Workflows } from '../src/types';
import { createActivities } from '../src/factories/createActivities';

type Client = {
  execute: <T extends keyof Workflows>(
    workflowType: T,
    args: Parameters<Workflows[T]>
  ) => ReturnType<Workflows[T]>;
  start: <T extends keyof Workflows>(
    workflowType: T,
    args: Parameters<Workflows[T]>
  ) => WorkflowHandleWithRunId<Workflows[T]>;
};

type RunWithWorkflowClientRoutine = (environment: {
  client: Client;
}) => Promise<void>;

// We want to conserve resources by only bunding the workflows one time
let workflowBundlePromise: Promise<WorkflowBundleWithSourceMap>;

export const runWithWorkflowClient = async (
  routine: RunWithWorkflowClientRoutine
): Promise<void> => {
  const taskQueue = `worker-${createUuid()}`;
  const context = {
    // database pool, redis client and other dependencies injected into activities
  };

  if (!workflowBundlePromise) {
    workflowBundlePromise = bundleWorkflowCode({
      workflowsPath: path.join(
        process.cwd(),
        'src/workflows'
      ),
    });
  }

  const workflowBundle = await workflowBundlePromise;

  const worker = await Worker.create({
    activities: createActivities(context),
    taskQueue,
    workflowBundle,
  });

  void worker.run().catch((error) => {
    console.log(error)
  });
  const connection = new Connection();
  const workflowClient = new WorkflowClient(connection.service);
  const client = {
    execute: async (workflowType, args) => {
      return await workflowClient.execute(workflowType, {
        args,
        taskQueue,
        workflowId: createUuid(),
      });
    },
    start: (workflowType, args) => {
      return workflowClient.start(workflowType, {
        args,
        taskQueue,
        workflowId: createUuid(),
      }) as any;
    },
  } as Client;

  try {
    await routine({ client });
  } finally {
    worker.shutdown();
  }
};
