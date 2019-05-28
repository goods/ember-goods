import Model from "ember-data/model";
import { belongsTo } from "@ember-decorators/data";
import User from "./user";
import Shop from "./shop";
import ShopRole from "./shop-role";

export default class ShopMember extends Model {
  @belongsTo("user") user!: User;
  @belongsTo("shop") shop!: Shop;
  @belongsTo("shop-role") role!: ShopRole;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-member": ShopMember;
  }
}
