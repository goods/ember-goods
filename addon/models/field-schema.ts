
import DS from "ember-data";

export default class FieldSchema extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") slug!: string;
  @DS.attr("string") order!: string;
  @DS.attr("string") description!: string;
  @DS.attr("string") data_type!: string;
  @DS.attr("string") field_type!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "field-schema": FieldSchema;
  }
}