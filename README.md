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
