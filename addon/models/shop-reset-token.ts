import DS from "ember-data";

export default class ShopResetToken extends DS.Model {
  @DS.attr("string") guid!: string;
  @DS.attr("boolean") isUsed!: boolean;
  @DS.attr("boolean") hasExpired!: boolean;
  @DS.attr("string") email!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-reset-token": ShopResetToken;
  }
}
