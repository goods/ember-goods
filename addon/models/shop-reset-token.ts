import Model from "ember-data/model";
import { attr } from "@ember-decorators/data";

export default class ShopResetToken extends Model {
  @attr("string") guid!: string;
  @attr("boolean") isUsed!: boolean;
  @attr("boolean") hasExpired!: boolean;
  @attr("string") email!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-reset-token": ShopResetToken;
  }
}
