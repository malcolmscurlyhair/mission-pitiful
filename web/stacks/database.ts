import { StackContext, Table } from "sst/constructs";

/**
 * Define a DynamoDB database and table so we can see how frequently
 * users guess a given company correctly from the mission statement.
 */
export function DynamoDB({ stack } : StackContext) {
  new Table(stack, "results", {
    fields: {
      company:    "string",
      correct:    "number",
      incorrect:  "number",
    },
    primaryIndex: { partitionKey: "company" },
  });
}
