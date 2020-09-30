/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { fork } = require('child_process')
const debug = require('debug')('aio-run-detached')
const path = require('path')
const pkg = require(path.join(__dirname, '..', 'package.json'))

/**
 * Run the commands specified in a detached process.
 *
 * @param {Array<string>} args the command to run and its arguments
 */
async function run (args = []) {
  if (args.length === 0) {
    throw new Error('You must specify at least one argument')
  }

  debug(`Running command detached: ${JSON.stringify(args)}`)
  const child = fork(args[0], args.slice(1), {
    detached: true,
    windowsHide: true,
    stdio: 'ignore'
  })
  debug(`Command detached PID: ${child.pid}`)

  if (process.send) {
    debug('IPC is available')
    const payload = {
      type: 'long-running-process',
      data: {
        bin: Object.keys(pkg.bin)[0],
        args,
        pid: child.pid
      }
    }
    debug(`Sending IPC payload: ${JSON.stringify(payload, null, 2)}`)
    process.send(payload)
  }

  child.unref()
  // eslint-disable-next-line no-process-exit
  process.exit(0)
}

module.exports = {
  run
}
