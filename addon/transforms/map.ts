import DS from 'ember-data';

const Map = DS.Transform.extend({
  deserialize(serialized) {
    return serialized;
  },

  serialize(deserialized) {
    return deserialized;
  }
});

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'map': Map;
  }
}

export default Map;
