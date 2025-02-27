// import { Trigger } from "deno-slack-api/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
// import { AppMentionWorkflow } from "../workflows/app_mention_workflow.ts";

const trigger = {
  type: TriggerTypes.Event,
  name: "App mention",
  workflow: "#/workflows/app_mention_workflow",
  event: {
    event_type: TriggerEventTypes.AppMentioned,
    all_resources: true,
  },
  // these are inputs that will be passed to the workflow.
  // these are not inputs to the trigger itself.
  inputs: {
    user_id: {
      value: "{{data.user_id}}"
    },
    text: {
      value: "{{data.text}}"
    },
    ts: {
      value: "{{data.message_ts}}"
    },
    channel: {
      value: "{{data.channel_id}}"
    }
  },
};

export default trigger;