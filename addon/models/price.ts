import Model from "ember-data/model";
import { attr } from "@ember-decorators/data";

export default class Price extends Model {
  @attr("number") value!: number;
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    price: Price;
  }
}
