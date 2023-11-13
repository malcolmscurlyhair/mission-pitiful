import type { SSTConfig } from "sst";
import { SvelteKitSite } from "sst/constructs";
import { DynamoDB } from "./stacks/database";

export default {
  config(_input) {
    return {
      name: "web",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new SvelteKitSite(stack, "site");
      stack.addOutputs({
        url: site.url,
      });
    });

    app.stack(DynamoDB)
  },
} satisfies SSTConfig;
