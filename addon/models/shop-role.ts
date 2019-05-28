import Model from "ember-data/model";
import { belongsTo, attr } from "@ember-decorators/data";
import Shop from "./shop";

export default class ShopRole extends Model {
  @attr("string") name!: string;
  @belongsTo("shop") shop!: Shop;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-role": ShopRole;
  }
}
