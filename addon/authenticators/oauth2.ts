//@ts-ignore
import OAuth2PasswordGrant from "ember-simple-auth/authenticators/oauth2-password-grant";
//@ts-ignore
import config from "ember-get-config";
import { isEmpty } from "@ember/utils";
import { assert } from "@ember/debug";

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: `${config.APP.goods.host}/tokens`,

  authenticate(identification: any, password: any, scope = [], headers = {}) {
    if (isEmpty(config.APP.goods.apiKey)) {
      assert("Goods apiKey must be added to the environment config");
    }
    if (isEmpty(config.APP.goods.spaceId)) {
      assert("Goods spaceId must be added to the environment config");
    }

    headers = {
      Authorization: "Bearer " + config.APP.goods.apiKey,
      "Space-ID": config.APP.goods.spaceId
    };

    return this._super(identification, password, scope, headers);
  }
});
