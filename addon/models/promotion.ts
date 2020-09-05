import DS from "ember-data";

export default class Promotion extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") description!: string;
  @DS.attr("string") code!: string;
  @DS.attr("string") startTime!: string;
  @DS.attr("string") finishTime!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "promotion": Promotion;
  }
}