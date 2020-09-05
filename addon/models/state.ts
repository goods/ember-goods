import DS from "ember-data";

export default class State extends DS.Model {
  @DS.attr("string") name!: string;
  @DS.attr("string") code!: string;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    "state": State;
  }
}