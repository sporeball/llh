import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AppMentionFunctionDefinition } from "../functions/app_mention_function.ts";

export const AppMentionWorkflow = DefineWorkflow({
  callback_id: 'app_mention_workflow',
  title: 'app mention',
  // these are inputs that get passed to the workflow fromm the trigger.
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

AppMentionWorkflow.addStep(
  AppMentionFunctionDefinition,
  {
    user_id: AppMentionWorkflow.inputs.user_id,
    text: AppMentionWorkflow.inputs.text,
    ts: AppMentionWorkflow.inputs.ts,
    channel: AppMentionWorkflow.inputs.channel,
  }
);