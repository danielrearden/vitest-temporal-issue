This repository reproduces an issue we encountered while attempting to migrate from jest to vitest. 

### Environment
* Node 16.15.1

### Steps to Reproduce
* Spin up a local temporal cluster by running `docker-compose up -d`
* `npm install`
* `npm test` -- you can customize the behavior of the test suites with the following environment variables:
  * `THREADS` (`boolean`) disables multi-threading
  * `SUITES` (`{0-5}`) number of files/suites to run
  * `TEST_PER_SUITE` (`{0-5}`) number of tests to run per suite
  * `DELAY` (`integer`) how long the Temporal activity should take to run in milliseconds

To get a failed execution, just run `npm test`. To get a successful execution, just run `THREADS=false npm test`.

### Notes
* The same tests run just fine in jest, even with workers enabled (i.e. no `--runInBand`)
* Disabling multi-threading fixes the issue (but obviously slows down tests to a painful pace)
* Running vitest against tests that do NOT attempt to spin up a Temporal worker causes no issues

### Errors

* A memory error that causes all subsequent tests to fail
```
RangeError [Error]: WebAssembly.instantiate(): Out of memory: wasm memory
    at node:internal/deps/cjs-module-lexer/dist/lexer:1:33593
Emitted 'error' event on Tinypool instance at:
    at EventEmitterReferencingAsyncResource.runInAsyncScope (node:async_hooks:202:9)
    at Tinypool.emit (file://***Projects/vitest-temporal-issue/node_modules/tinypool/dist/esm/index.js:60:31)
    at Worker.<anonymous> (file://***Projects/vitest-temporal-issue/node_modules/tinypool/dist/esm/index.js:566:30)
    at Worker.emit (node:events:527:28)
    at Worker.[kOnErrorMessage] (node:internal/worker:289:10)
    at Worker.[kOnMessage] (node:internal/worker:300:37)
    at MessagePort.<anonymous> (node:internal/worker:201:57)
    at MessagePort.[nodejs.internal.kHybridDispatch] (node:internal/event_target:643:20)
    at MessagePort.exports.emitMessage (node:internal/per_context/messageport:23:28)
```
* Multiple unhandled rejections returned even when tests seemingly pass
```
Error: A panic occurred while executing a `neon::event::Channel::send` callback
```
* This error that pops up when we drop the number of tests per suite but keep multi-threading on
```
thread '<unnamed>' panicked at 'Attempted to dereference a `neon::handle::Root` from the wrong module ', /Users/runner/.cargo/registry/src/github.com-1ecc6299db9ec823/neon-0.10.1/src/handle/root.rs:168:13
FATAL ERROR: /Users/runner/.cargo/registry/src/github.com-1ecc6299db9ec823/neon-runtime-0.10.1/src/napi/tsfn.rs:191:18 Failed to set an object property
 1: 0x1044742dc node::Abort() [***.nvm/versions/node/v16.15.1/bin/node]
 2: 0x104474464 node::errors::TryCatchScope::~TryCatchScope() [***.nvm/versions/node/v16.15.1/bin/node]
 3: 0x1044742f4 node::OnFatalError(char const*, char const*) [***.nvm/versions/node/v16.15.1/bin/node]
 4: 0x104448cdc napi_open_callback_scope [***.nvm/versions/node/v16.15.1/bin/node]
 5: 0x11601987c neon_runtime::napi::error::fatal_error::h36bb70038ef82b4d [***Projects/vitest-temporal-issue/node_modules/@temporalio/core-bridge/releases/aarch64-apple-darwin/index.node]
 6: 0x116019f6c neon_runtime::napi::no_panic::create_error::h5fc2dfded95b7565 [***Projects/vitest-temporal-issue/node_modules/@temporalio/core-bridge/releases/aarch64-apple-darwin/index.node]
 7: 0x116483670 neon_runtime::napi::tsfn::ThreadsafeFunction$LT$T$GT$::callback::h93e803bb4ad8e14a [***Projects/vitest-temporal-issue/node_modules/@temporalio/core-bridge/releases/aarch64-apple-darwin/index.node]
 8: 0x10444b744 v8impl::(anonymous namespace)::ThreadSafeFunction::AsyncCb(uv_async_s*) [***.nvm/versions/node/v16.15.1/bin/node]
 9: 0x104ce5f00 uv__async_io [***.nvm/versions/node/v16.15.1/bin/node]
10: 0x104cf7c78 uv__io_poll [***.nvm/versions/node/v16.15.1/bin/node]
11: 0x104ce6390 uv_run [***.nvm/versions/node/v16.15.1/bin/node]
12: 0x1043c2ccc node::SpinEventLoop(node::Environment*) [***.nvm/versions/node/v16.15.1/bin/node]
13: 0x1045069e8 node::worker::Worker::Run() [***.nvm/versions/node/v16.15.1/bin/node]
14: 0x104509c10 node::worker::Worker::StartThread(v8::FunctionCallbackInfo<v8::Value> const&)::$_3::__invoke(void*) [***.nvm/versions/node/v16.15.1/bin/node]
15: 0x1a03d426c _pthread_start [/usr/lib/system/libsystem_pthread.dylib]
16: 0x1a03cf08c thread_start [/usr/lib/system/libsystem_pthread.dylib]
```
