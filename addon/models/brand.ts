import DS from 'ember-data';

export default class Brand extends DS.Model {
  @DS.attr('string') declare name: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    brand: Brand;
  }
}
