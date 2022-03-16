//@ts-ignore
import JSONAPIAdapter from "@ember-data/adapter/json-api";
//@ts-ignore
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import { isNone } from "@ember/utils";
//@ts-ignore
import config from "ember-get-config";
import { computed, get } from "@ember/object";
import { inject } from "@ember/service";

export default class ApplicationAdapter extends JSONAPIAdapter.extend(
  DataAdapterMixin,
  {
    pathForType(type: any) {
      let prefix = "";

      if (config.APP.goods.apiV2) {
        prefix += "api/";
      }

      let schema = this.store.modelFor(type);
      if (schema.isContentEntry === true) {
        prefix += "content/";
      }

      return prefix + this._super(...arguments);
    },
  }
) {
  coalesceFindRequests = true;
  host = config.APP.goods.host;

  @inject declare session: any;

  @computed("session.data.authenticated.access_token")
  get headers() {
    //Support legacy access_token
    if (!isNone(config.APP.goods.access_token)) {
      return {
        Authorization: `Bearer ${config.APP.goods.access_token}`,
      };
    }

    //@ts-ignore
    let { access_token } = get(this, "session.data.authenticated");

    if (isNone(access_token)) {
      access_token = config.APP.goods.apiKey;
    }
    return {
      Authorization: `Bearer ${access_token}`,
      "Space-ID": config.APP.goods.spaceId,
    };
  }
}
