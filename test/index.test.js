const index = require('../src/index')

jest.mock('child_process')
const { fork } = require('child_process')

beforeAll(() => {
  process.exit = jest.fn()
})

beforeEach(() => {
  jest.resetAllMocks()
})

test('exports', () => {
  expect(index.run).toBeDefined()
  expect(typeof index.run).toEqual('function')
})

test('run (no args)', async () => {
  await expect(index.run).rejects.toEqual(new Error('You must specify at least one argument'))
})

test('run (with args, process.send available)', async () => {
  const pid = 123
  const forkMockReturn = {
    pid,
    unref: jest.fn()
  }
  fork.mockReturnValueOnce(forkMockReturn)

  const args = ['command', 'arg1']
  process.send = jest.fn()
  await index.run(args)

  expect(forkMockReturn.unref).toHaveBeenCalled()
  expect(process.send).toHaveBeenCalledWith({
    data: {
      args,
      bin: 'aio-run-detached',
      pid
    },
    type: 'long-running-process'
  })
})

test('run (with args, process.send not available)', async () => {
  const pid = 456
  const forkMockReturn = {
    pid,
    unref: jest.fn()
  }
  fork.mockReturnValueOnce(forkMockReturn)

  const args = ['command', 'arg1']
  process.send = undefined
  await index.run(args)

  expect(forkMockReturn.unref).toHaveBeenCalled()
})
