import DS from "ember-data";
import ShopResetToken from "./shop-reset-token";

export default class ShopPasswordChange extends DS.Model {
  @DS.attr("string") password!: string;
  @DS.belongsTo("shop-reset-token") resetToken!: ShopResetToken;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-password-change": ShopPasswordChange;
  }
}
