import DS from 'ember-data';
import Brand from './brand';
import Sku from './sku';
import ProductCategory from './product-category';
import ShopProductPaymentMethod from './shop-product-payment-method';

export default class Product extends DS.Model {
  @DS.attr('string') declare name: string;
  @DS.attr('string') declare summary: string;
  @DS.attr('string') declare description: string;
  @DS.attr('string') declare slug: string;
  @DS.attr('string') declare skuName: string;
  @DS.attr() declare taxonomy: any;
  @DS.belongsTo('brand') declare brand: Brand;
  @DS.hasMany('sku') declare skus: Sku[];
  @DS.hasMany('product-category') declare productCategories: ProductCategory[];
  @DS.hasMany('shop-product-payment-method')
  declare shopProductPaymentMethods: ShopProductPaymentMethod[];
  @DS.attr() declare attrs: any;
  @DS.attr() declare schema: any;
  @DS.attr() declare skuSchema: any;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    product: Product;
  }
}
