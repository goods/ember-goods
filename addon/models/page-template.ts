import DS from 'ember-data';

export default class PageTemplate extends DS.Model {
  @DS.attr("string") declare name: string;
  @DS.attr("string") declare pageType: string;
  @DS.attr("string") declare description: string;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'page-template': PageTemplate;
  }
}
