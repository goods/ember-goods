import DS from 'ember-data';
import Brand from './brand';
import Sku from './sku';
import ProductCategory from './product-category';
import ShopProductPaymentMethod from './shop-product-payment-method';

const DEFAULT_MAX = 9999;
const DEFAULT_MIN = 0;

export default class Product extends DS.Model {
  @DS.attr('string') declare name: string;
  @DS.attr('string') declare summary: string;
  @DS.attr('string') declare description: string;
  @DS.attr('string') declare slug: string;
  @DS.attr('string') declare skuName: string;
  @DS.attr('number', { defaultValue: DEFAULT_MAX }) declare maxQuantity: number;
  @DS.attr('number', { defaultValue: DEFAULT_MIN }) declare minQuantity: number;
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
