import DS from "ember-data";
import Sku from "./sku";

export default class SkuImage extends DS.Model {
  @DS.attr("string") filename!: string;
  @DS.attr("string") originalUrl!: string;
  @DS.attr("string") thumbUrl!: string;
  @DS.attr("string") thumbLargeUrl!: string;
  @DS.belongsTo("sku") sku: Sku;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "sku-image": SkuImage;
  }
}
