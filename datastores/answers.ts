import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const AnswersDatastore = DefineDatastore({
  name: "answers",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    slug: { type: Schema.types.string },
    answer: { type: Schema.types.string },
  }
});