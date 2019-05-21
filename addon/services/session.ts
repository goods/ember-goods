//@ts-ignore
import SessionService from "ember-simple-auth/services/session";
import { inject } from "@ember/service";
import { computed, get } from "@ember/object";

export default class Session extends SessionService.extend({
  store: inject(),
  user: computed(function() {
    return get(this, "store").queryRecord("user", { filter: { me: "me" } });
  })
}) {}

declare module "@ember/service" {
  interface Registry {
    session: Session;
  }
}
