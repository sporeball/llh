# solvian

**solvian** is a bot for the Hack Club Slack to help answer frequently asked questions.

## usage

add the answer to a question to solvian's data store with `[ANSWER] cc @solvian [KEY]`.\
(only [@lux](https://github.com/sporeball) can do this)

tell solvian to give the answer to a question with `@solvian [KEY]?`.\
(anybody can do this)

## reactions

solvian gives the following emoji reactions in response to user input:

- 👍 - solvian found the answer associated with a key.
- 👎 - solvian didn't find the answer associated with a key.
- 🧿 - solvian added an answer to its data store.
- ⛔️ - solvian did not allow an answer to be added to its data store.
- ❔ - solvian did not recognize what it was being asked for.
- ⚠ - solvian encountered an error. (this shouldn't happen)

## example

say somebody asks "when does [Black Box](https://github.com/hackclub/black-box) end?"\
those with permission to add to solvian's data store can reply in the thread and say something like "Black Box will end on March 15! cc @solvian end date".\
now, if a second user asks the same question, anybody can help the second user by replying in their thread with "@solvian end date?".

## license

MIT