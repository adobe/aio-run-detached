<!--
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->

[![Version](https://img.shields.io/npm/v/@adobe/aio-run-detached.svg)](https://npmjs.org/package/@adobe/aio-run-detached)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/aio-run-detached.svg)](https://npmjs.org/package/@adobe/aio-run-detached)
[![Build Status](https://travis-ci.com/adobe/aio-run-detached.svg?branch=master)](https://travis-ci.com/adobe/aio-run-detached)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) 
[![Codecov Coverage](https://img.shields.io/codecov/c/github/adobe/aio-run-detached/master.svg?style=flat-square)](https://codecov.io/gh/adobe/aio-run-detached/)

# @adobe/aio-run-detached

Helper command for the Adobe I/O CLI [App Plugin](https://github.com/adobe/aio-cli-plugin-app) and Adobe [Project Firefly](https://www.adobe.io/apis/experienceplatform/project-firefly/docs.html).

This command runs another command in a detached process, and reports to the parent process that calls it, the detached process' pid for cleanup in the future.

You would run your command in a detached process if it is a long running process, and the use case for it is running a command in a [Project Firefly Event Hook.](https://www.adobe.io/apis/experienceplatform/project-firefly/docs.html#!AdobeDocs/project-firefly/master/guides/app-hooks.md)

For example, if you have a long running command called `long-running-process.sh`, and you want to run it in the `pre-app-run` app hook, you prefix your command with `aio-run-detached` like so in your app's `package.json`:
```json
{
  "scripts": {
    "pre-app-run": "aio-run-detached long-running-process.sh"
  }
}
```

You will need to add `@adobe/aio-run-detached` as a dependency:
```bash
npm install @adobe/aio-run-detached
```

`aio-run-detached` will report back to the App plugin the process id of the detached process, so that the App plugin can terminate the detached process when the App plugin command exits.

### Contributing

Contributions are welcome! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.