import DS from 'ember-data';
import Price from './price';
import Product from './product';
import Bom from './bom';

export default class Sku extends DS.Model {
  @DS.attr('number') declare stockQuantity: number;
  @DS.attr('map', {
    defaultValue: () => {
      return {};
    },
  })
  attrs: any;
  @DS.belongsTo('price') declare price: Price;
  @DS.belongsTo('product') declare product: Product;
  @DS.belongsTo('bom', { async: false }) declare bom: Bom;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    sku: Sku;
  }
}
