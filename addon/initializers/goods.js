import BasketItem from 'ember-goods/models/basket-item';
import Order from 'ember-goods/models/order';
import Product from 'ember-goods/models/product';
import Sku from 'ember-goods/models/sku';
import GoodsAdapter from '../adapters/goods';
import GoodsSerializer from '../serializers/goods';
import GoodsService from '../services/goods';

export function initialize(application) {
  application.register('adapter:application', GoodsAdapter);
  application.register('serializer:application', GoodsSerializer);
  application.register('service:goods', GoodsService);
  application.register('model:order', Order);
  application.register('model:product', Product);
  application.register('model:sku', Sku);
  application.register('model:basket-item', BasketItem);
}

export default {
  name: 'goods',
  initialize,
};
