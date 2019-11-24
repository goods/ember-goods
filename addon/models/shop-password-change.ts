import Model from "ember-data/model";
import { attr, belongsTo } from "@ember-decorators/data";
import ShopResetToken from "./shop-reset-token";

export default class ShopPasswordChange extends Model {
  @attr("string") password!: string;
  @belongsTo("shop-reset-token") resetToken!: ShopResetToken;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-password-change": ShopPasswordChange;
  }
}
