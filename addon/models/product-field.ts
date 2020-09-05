import DS from "ember-data";

export default class ProductField extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") slug!: string;
  @DS.attr() values!: any;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "product-field": ProductField;
  }
}