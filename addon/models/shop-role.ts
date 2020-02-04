import DS from "ember-data";
import Shop from "./shop";

export default class ShopRole extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.belongsTo("shop") shop!: Shop;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-role": ShopRole;
  }
}
