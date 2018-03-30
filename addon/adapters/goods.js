import EmberError from "@ember/error";
import JSONAPIAdapter from "ember-data/adapters/json-api";

export default JSONAPIAdapter.extend({
  coalesceFindRequests: true
});
