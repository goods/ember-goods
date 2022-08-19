import Service, { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import BasketItem from 'ember-goods/models/basket-item';
import Product from 'ember-goods/models/product';
import Goods from './goods';
import GoodsCommerce from './goods-commerce';
import Basket from 'ember-goods/models/basket';
import Order from 'ember-goods/models/order';

interface ProductListParams {
  listName: string;
  listId: string;
  products: Product[];
}

const ERROR_DISABLED =
  'Goods Metrics has been used but it is not enabled in the environment configuration.';

export default class GoodsMetrics extends Service {
  @inject declare goods: Goods;
  @inject('goods-commerce') declare commerce: GoodsCommerce;

  /*
   *
   */
  //@ts-ignore
  dataLayer = window['dataLayer'] || [];

  get env() {
    let owner: any = getOwner(this);
    return owner.resolveRegistration('config:environment');
  }

  get isTest() {
    return this.env.environment == 'test';
  }

  async initialize() {
    //noop
  }

  /**
   * Track a product list view
   * @param products
   */
  trackProductListView({ listName, listId, products }: ProductListParams) {
    this.resetDataLayer();
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    let items = products.map((product) => {
      return {
        item_name: product.get('name'),
        item_id: product.get('id'),
        item_brand: product.get('brand').get('name'),
        item_list_name: listName,
        item_list_id: listId,
        index: product.get('attrs').order,
      };
    });

    this.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        items,
      },
    });
  }

  /**
   * Track a product detail view
   * @param product
   */
  trackProductView(product: Product) {
    this.resetDataLayer();
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    let items = [
      {
        item_name: product.get('name'),
        item_id: product.get('id'),
        item_brand: product.get('brand').get('name'),
      },
    ];

    this.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        items,
      },
    });
  }

  /**
   *
   * @param basketItems
   * @returns
   */
  trackAddToBasket(basketItems: BasketItem[]) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();
      let items = basketItems.map((basketItem) => {
        let sku = basketItem.get('sku');
        let product = sku.get('product');

        return {
          item_name: product.get('name'),
          item_id: product.get('id'),
          item_brand: product.get('brand').get('name'),
          price: this.commerce.formatCurrency(basketItem.get('price')),
          item_variant: this.commerce.getSkuName(
            sku.get('attrs'),
            product.get('skuName')
          ),
          quantity: basketItem.get('quantity'),
        };
      });

      let total = basketItems.reduce(
        (total, basketItem) =>
          total + basketItem.get('quantity') * basketItem.get('price'),
        0
      );
      let value = this.commerce.formatCurrency(total);

      this.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'GBP',
          value,
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param basketItems
   */
  trackRemoveFromBasket(basketItems: BasketItem[]) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();
      let items = basketItems.map((basketItem) => {
        let sku = basketItem.get('sku');
        let product = sku.get('product');

        return {
          item_name: product.get('name'),
          item_id: product.get('id'),
          item_brand: product.get('brand').get('name'),
          price: this.commerce.formatCurrency(basketItem.get('price')),
          item_variant: this.commerce.getSkuName(
            sku.get('attrs'),
            product.get('skuName')
          ),
          quantity: basketItem.get('quantity'),
        };
      });

      let total = basketItems.reduce(
        (total, basketItem) =>
          total + basketItem.get('quantity') * basketItem.get('price'),
        0
      );
      let value = this.commerce.formatCurrency(total);

      this.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: 'GBP',
          value,
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param basketItem
   * @returns
   */
  trackSelectPromotion(basketItem: BasketItem) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();

      let sku = basketItem.get('sku');
      let product = sku.get('product');

      let items = [
        {
          item_id: product.get('id'),
          item_brand: product.get('brand').get('name'),
          discount: this.commerce.formatCurrency(basketItem.get('price')),
          promotion_id: basketItem.get('promotion').get('code'),
          promotion_name: basketItem.get('promotion').get('name'),
          quantity: basketItem.get('quantity'),
        },
      ];

      this.dataLayer.push({
        event: 'select_promotion',
        ecommerce: {
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param basketItems
   * @returns
   */
  trackBeginCheckout(basket: Basket) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();

      let items = basket.get('basketItems').map((basketItem) => {
        let sku = basketItem.get('sku');
        let product = sku.get('product');

        return {
          item_name: product.get('name'),
          item_id: product.get('id'),
          item_brand: product.get('brand').get('name'),
          price: this.commerce.formatCurrency(basketItem.get('price')),
          item_variant: this.commerce.getSkuName(
            sku.get('attrs'),
            product.get('skuName')
          ),
          quantity: basketItem.get('quantity'),
        };
      });

      let total = basket
        .get('basketItems')
        .reduce(
          (total, basketItem) =>
            total + basketItem.get('quantity') * basketItem.get('price'),
          0
        );
      let value = this.commerce.formatCurrency(total);

      this.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'GBP',
          value,
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param order
   * @returns
   */
  trackPurchase(order: Order) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();

      let items = order.get('orderLines').map((orderLine) => {
        let sku = orderLine.get('sku');
        let product = sku.get('product');

        return {
          item_name: product.get('name'),
          item_id: product.get('id'),
          item_brand: product.get('brand').get('name'),
          price: this.commerce.formatCurrency(orderLine.get('price')),
          item_variant: this.commerce.getSkuName(
            sku.get('attrs'),
            product.get('skuName')
          ),
          quantity: orderLine.get('quantity'),
        };
      });

      //Push this purchase event
      this.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: order.get('id'),
          value: this.commerce.formatCurrency(order.get('total')),
          currency: 'GBP',
          items,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  resetDataLayer() {
    this.dataLayer.push(function () {
      this.reset();
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'goods-metrics': GoodsMetrics;
  }
}
