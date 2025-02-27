import { Manifest } from "deno-slack-sdk/mod.ts";
import { AppMentionWorkflow } from "./workflows/app_mention_workflow.ts";
import { AppMentionFunctionDefinition } from "./functions/app_mention_function.ts";
import { AnswersDatastore } from "./datastores/answers.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "solvian",
  description: "answer frequently asked questions",
  icon: "assets/icon.png",
  datastores: [AnswersDatastore],
  functions: [AppMentionFunctionDefinition],
  workflows: [AppMentionWorkflow],
  outgoingDomains: [],
  botScopes: ["chat:write", "chat:write.public", "reactions:write", "app_mentions:read", "datastore:read", "datastore:write", "channels:history", "groups:history", "im:history", "mpim:history"],
});
