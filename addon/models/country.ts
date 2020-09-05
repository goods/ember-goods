import DS from "ember-data";

export default class Country extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") alpha2!: string;
  @DS.attr("string") alpha3!: string;
  @DS.attr("string") continent!: string;
  @DS.attr("string") currencyCode!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "country": Country;
  }
}