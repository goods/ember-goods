import DS from "ember-data";
import { EmbeddedRecordsMixin } from "@ember-data/serializer/rest";

export default class Quote extends DS.JSONAPISerializer.extend(
  EmbeddedRecordsMixin
) {
  isEmbeddedRecordsMixinCompatible = true;

  attrs = {
    lines: {
      serialize: "records",
      deserialize: false,
    },
  };
}

// DO NOT DELETE: this is how TypeScript knows how to look up your serializers.
declare module "ember-data/types/registries/serializer" {
  export default interface SerializerRegistry {
    quote: Quote;
  }
}
