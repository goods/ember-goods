import DS from "ember-data";
import User from "./user";
import Shop from "./shop";
import ShopRole from "./shop-role";

export default class ShopMember extends DS.Model {
  @DS.belongsTo("user") user!: User;
  @DS.belongsTo("shop") shop!: Shop;
  @DS.belongsTo("shop-role") role!: ShopRole;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "shop-member": ShopMember;
  }
}
