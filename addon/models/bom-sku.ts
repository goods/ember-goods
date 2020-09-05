import DS from "ember-data";
import Sku from "./sku";
import Bom from "./bom";

export default class BomSku extends DS.Model {
  @DS.attr("number") quantity!: number;
  @DS.belongsTo("sku", { async: false }) sku!: Sku;
  @DS.belongsTo("bom", { async: false }) bom!: Bom;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "bom-sku": BomSku;
  }
}
