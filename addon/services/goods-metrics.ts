import Service, { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';
import BasketItem from 'ember-goods/models/basket-item';
import Product from 'ember-goods/models/product';
import Goods from './goods';
import GoodsCommerce from './goods-commerce';
import Basket from 'ember-goods/models/basket';
import Order from 'ember-goods/models/order';
//@ts-ignore
import config from 'ember-get-config';

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

  /**
   *
   */
  get config(): any {
    return Object.assign(
      {},
      {
        enabled: false,
        productUrl: '/products/{{product.slug}}',
        productImage: 'image',
      },
      config.APP.goods.metrics
    );
  }

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
   * Track an event
   * @param products
   */
  trackEvent(eventName: string, params: any = {}) {
    this.resetDataLayer();
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    this.dataLayer.push({
      event: eventName,
      params,
    });
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

      let payments = order.get('payments').map((payment) => ({
        amount: this.commerce.formatCurrency(payment.get('amount')),
        currency: 'GBP',
        type: payment.get('shopPaymentMethod').get('paymentMethod').get('name'),
        billing_address_1: order.get('billingAddress1'),
        billing_address_2: order.get('billingAddress2'),
        billing_city: order.get('billingCity'),
        billing_region: order.get('billingRegion'),
        billing_postcode: order.get('billingPostcode'),
        billing_country: order.get('billingCountry'),
      }));

      let items = order.get('orderLines').map((orderLine) => {
        let sku = orderLine.get('sku');
        let product = sku.get('product');
        let productAttrs = product.get('attrs');

        let coupon = null;
        if (orderLine.get('promotion') != null) {
          coupon = orderLine.get('promotion').get('code');
        }

        let productUrl =
          window.location.origin +
          this.commerce.generateProductText(
            this.config.productUrl,
            sku.get('product')
          );

        let productImageAttr = productAttrs[this.config.productImageField];
        let productImageUrl = '';
        if (isPresent(productImageAttr)) {
          productImageUrl = productImageAttr.originalUrl;
        }

        return {
          id: product.get('id'),
          product_name: product.get('name'),
          sku_name: this.commerce.getSkuName(
            sku.get('attrs'),
            product.get('skuName')
          ),
          attrs: sku.get('attrs'),
          url: productUrl,
          image_url: productImageUrl,
          taxonomy: product.get('taxonomy'),
          price: {
            amount: this.commerce.formatCurrency(orderLine.get('price')),
            amount_without_tax: this.commerce.formatCurrency(
              orderLine.get('priceWithoutTax')
            ),
            currency: 'GBP',
          },
          coupon: coupon,
          subtotal: this.commerce.formatCurrency(
            orderLine.get('price') * orderLine.get('quantity')
          ),
          quantity: orderLine.get('quantity'),
        };
      });

      //Push this purchase event
      this.dataLayer.push({
        event: 'goods-purchase',
        order: {
          id: order.get('id'),
          currency: 'GBP',
          total: this.commerce.formatCurrency(order.get('total')),
          shipping_cost: 0,
          shipping_address: {
            name: order.get('name'),
            address_1: order.get('shippingAddress1'),
            address_2: order.get('shippingAddress2'),
            city: order.get('shippingCity'),
            region: order.get('shippingRegion'),
            postcode: order.get('shippingPostcode'),
            country: order.get('shippingCountry'),
          },
          payments,
          items,
        },
      });

      // Push the deprecated GA event
      this.dataLayer.push({
        event: 'purchase',
        ecommerce: this.getDeprecatedEcommerceObject(order),
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * This returns the ecommerce object directly in Google Analytics format.
   * Needs to be replaced in GTM by using the custom data structure.
   *
   * @deprecated
   * @param order
   * @returns
   */
  getDeprecatedEcommerceObject(order: Order) {
    let items = order.get('orderLines').map((orderLine) => {
      let sku = orderLine.get('sku');
      let product = sku.get('product');

      let coupon = null;
      if (orderLine.get('promotion') != null) {
        coupon = orderLine.get('promotion').get('code');
      }

      return {
        item_name: product.get('name'),
        item_id: product.get('id'),
        price: this.commerce.formatCurrency(orderLine.get('price')),
        price_without_tax: this.commerce.formatCurrency(
          orderLine.get('priceWithoutTax')
        ),
        coupon: coupon,
        item_variant: this.commerce.getSkuName(
          sku.get('attrs'),
          product.get('skuName')
        ),
        quantity: orderLine.get('quantity'),
      };
    });

    return {
      ecommerce: {
        transaction_id: order.get('id'),
        value: this.commerce.formatCurrency(order.get('total')),
        currency: 'GBP',
        items,
      },
    };
  }

  /**
   *
   * @param order
   * @returns
   */
  trackUserCreated(
    email: string,
    phoneNumber: string,
    name: string,
    gdprOptin: boolean,
    emailOptin: boolean
  ) {
    if (this.goods.metricsConfig.enabled == false) {
      if (this.isTest == false) {
        console.error(ERROR_DISABLED);
      }
      return;
    }

    try {
      this.resetDataLayer();

      this.dataLayer.push({
        event: 'user_created',
        user: {
          id: email,
          email: email,
          phoneNumber: phoneNumber,
          name: name,
          gdprOptin: gdprOptin,
          emailOptin: emailOptin,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  resetDataLayer() {
    this.dataLayer.push(function () {
      //@ts-ignore
      this.reset();
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'goods-metrics': GoodsMetrics;
  }
}
