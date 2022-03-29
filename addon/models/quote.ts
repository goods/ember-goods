import DS from "ember-data";
import QuoteLine from "./quote-line";

export default class Quote extends DS.Model {
  @DS.attr("string") declare session_id: string;
  @DS.hasMany("quote-line") declare lines: QuoteLine[];
}

declare module "ember-data/types/registries/model" {
  export default interface ModelRegistry {
    quote: Quote;
  }
}
