/* @ts-ignore */
import type { Services } from "@permaweb/aoconnect/dist/index.common";
import { connect, type result, type results, type message, type spawn, type monitor, type unmonitor, type dryrun } from "@permaweb/aoconnect";

export interface AoClient {
  processId: string;
  scheduler?: string; // arweave txid of schedular location
  ao: {
    // aoconnect imports for function types arent working, so this is a bandaid solution
    message: typeof message;
    result: typeof result;
    results: typeof results;
    dryrun: typeof dryrun;
    spawn: typeof spawn;
    monitor: typeof monitor;
    unmonitor: typeof unmonitor;
  };
}

export class AoProvider implements AoClient {
  processId: string;
  scheduler?: string;
  ao: {
    message: typeof message;
    result: typeof result;
    results: typeof results;
    dryrun: typeof dryrun;
    spawn: typeof spawn;
    monitor: typeof monitor;
    unmonitor: typeof unmonitor;
  };

  constructor(params: {
    processId: string;
    scheduler?: string;
    connectConfig?: Services;
  }) {
    this.processId = params.processId;
    this.scheduler = params.scheduler;
    this.ao = connect(params.connectConfig);
  }
}