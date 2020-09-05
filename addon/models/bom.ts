import DS from "ember-data";
import Sku from "./sku";
import BomSku from "./bom-sku";

export default class Bom extends DS.Model {
  @DS.belongsTo("sku", { async: false }) sku!: Sku;
  @DS.hasMany("bom-sku", { async: false }) bomSkus!: BomSku[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    bom: Bom;
  }
}
