import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { AnswersDatastore } from "../datastores/answers.ts";

export const AppMentionFunctionDefinition = DefineFunction({
  callback_id: "app_mention_function",
  title: "App mention function",
  description: "A function to call when the app is mentioned",
  source_file: "functions/app_mention_function.ts",
  // this should be the same object as the one received by the workflow.
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
      text: {
        type: Schema.types.string,
      },
      ts: {
        type: Schema.slack.types.message_ts,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      }
    },
    required: ["user_id", "text", "ts", "channel"]
  }
});

// TODO: make this not so monolithic
export default SlackFunction(AppMentionFunctionDefinition, async ({ inputs, client }) => {
  const { user_id, text, ts, channel } = inputs;
  const get_answer_match = text.match(/(<@.+?>) (.+?)\?/);
  const set_answer_match = text.match(/(.+?) cc (<@.+?>) (.+?)$/);
  // get answer
  if (get_answer_match !== null) {
    // get data from the match
    const slug = get_answer_match[2];
    // query the datastore - must be ok
    const datastore_query = await client.apps.datastore.query<typeof AnswersDatastore.definition>({
      datastore: AnswersDatastore.name,
      expression: "#slug = :islug",
      expression_attributes: { "#slug": "slug" },
      expression_values: { ":islug": slug }
    });
    if (!datastore_query.ok) {
      await client.reactions.add({
        channel,
        name: "warning",
        timestamp: ts
      });
      console.error(`failed to query datastore: ${datastore_query.error}`);
      return { error: `failed to query datastore: ${datastore_query.error}` };
    }
    if (datastore_query.items.length === 0) {
      await client.reactions.add({
        channel,
        name: "thumbsdown",
        timestamp: ts
      });
      return { outputs: {} };
    }
    // send the answer - there should only be one
    for (const item of datastore_query.items) {
      // do work
      try {
        // get context of first message in thread
        const thread = await client.conversations.replies({
          channel,
          ts
        });
        // post message
        await client.chat.postMessage({
          channel,
          text: item.answer,
          thread_ts: thread.messages[0].thread_ts,
        });
        // add reaction
        await client.reactions.add({
          channel,
          name: "thumbsup",
          timestamp: ts
        });
      } catch (e) {
        await client.reactions.add({
          channel,
          name: "warning",
          timestamp: ts
        });
        console.error(`failed when threading: ${e}`);
        return { error: `failed when threading: ${e}` };
      }
    }
    // add reaction
    await client.reactions.add({
      channel,
      name: "thumbsup",
      timestamp: ts
    })
  }
  // set answer
  else if (set_answer_match !== null) {
    // for right now, you've gotta be @lux to do this
    if (user_id !== 'U01G0Q9K998') {
      await client.reactions.add({
        channel,
        name: "no_entry",
        timestamp: ts
      });
      return { outputs: {} };
    }
    // get data from the match
    const answer = set_answer_match[1];
    const slug = set_answer_match[3];
    // use datastore
    const uuid = crypto.randomUUID();
    const datastore_put = await client.apps.datastore.put<typeof AnswersDatastore.definition>({
      datastore: AnswersDatastore.name,
      item: { id: uuid, slug, answer }
    });
    if (!datastore_put.ok) {
      await client.reactions.add({
        channel,
        name: "warning",
        timestamp: ts
      });
      console.error(`failed to save answer to datastore: ${datastore_put.error}`);
      return { error: `failed to save answer to datastore: ${datastore_put.error}` };
    }
    // add reaction
    await client.reactions.add({
      channel,
      name: "nazar_amulet",
      timestamp: ts
    });
  }
  // format of message was unknown
  else {
    await client.reactions.add({
      channel,
      name: "grey_question",
      timestamp: ts
    });
  }
  // return value
  return { outputs: {} };
});