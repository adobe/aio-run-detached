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

const { spawn } = require('child_process')
const { lookpath } = require('lookpath')
const npmRunPath = require('npm-run-path')
const debug = require('debug')('aio-run-detached')
const path = require('path')
const pkg = require(path.join(__dirname, '..', 'package.json'))
const fs = require('fs')
const os = require('os')

const LOGS_FOLDER = 'logs'

/**
 * Starts out a log file using the name provided.
 *
 * @param {string} name the name of the log file
 * @returns {object} properties: fd for filedescriptor, filepath for log file path
 */
function startLog (name) {
  const filepath = path.resolve(path.join(LOGS_FOLDER, name))
  const timestamp = new Date().toISOString()

  const fd = fs.openSync(filepath, 'a')
  fs.writeSync(fd, `${timestamp} log start${os.EOL}`)
  debug(`Writing to logfile ${filepath}`)

  return {
    fd,
    filepath
  }
}

/**
 * Run the commands specified in a detached process.
 *
 * @param {Array<string>} args the command to run and its arguments
 */
async function run (args = []) {
  if (args.length === 0) {
    throw new Error('You must specify at least one argument')
  }

  // add the node_modules/.bin folder to the path
  process.env.PATH = npmRunPath()
  // lookpath looks for the command in the path, and checks whether it is executable
  const commandPath = await lookpath(args[0])
  if (!commandPath) {
    throw new Error(`Command "${args[0]}" was not found in the path, or is not executable.`)
  } else {
    debug(`Command "${args[0]}" found at ${commandPath}`)
  }

  if (!fs.existsSync(LOGS_FOLDER)) {
    fs.mkdirSync(LOGS_FOLDER)
  }

  const outFile = startLog(`${args[0]}.out.log`)
  const errFile = startLog(`${args[0]}.err.log`)

  debug(`Running command detached: ${JSON.stringify(args)}`)
  const child = spawn(commandPath, args.slice(1), {
    detached: true,
    windowsHide: true,
    shell: true,
    stdio: [
      'ignore',
      outFile.fd,
      errFile.fd,
      'ipc'
    ]
  })
  debug(`Command detached PID: ${child.pid}`)

  if (process.send) {
    debug('IPC is available')
    const payload = {
      type: 'long-running-process',
      data: {
        bin: Object.keys(pkg.bin)[0],
        args,
        logs: {
          stdout: outFile.filepath,
          stderr: errFile.filepath
        },
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
