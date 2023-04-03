import Service from '@ember/service';
import { inject } from '@ember/service';
import { isNone, isEmpty } from '@ember/utils';
import Session from './session';
import { get } from '@ember/object';
//@ts-ignore
import Store from '@ember-data/store';
import Basket from 'ember-goods/models/basket';
import { tracked } from '@glimmer/tracking';
//@ts-ignore
import config from 'ember-get-config';
import BasketItem from 'ember-goods/models/basket-item';
import Country from 'ember-goods/models/country';
import State from 'ember-goods/models/state';
import Order from 'ember-goods/models/order';
import Goods from './goods';
import Sku from 'ember-goods/models/sku';
import Payment from 'ember-goods/models/payment';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';

export default class GoodsCommerce extends Service {
  /**
   *
   */
  @inject declare session: Session;

  /**
   *
   */
  @inject declare store: Store;

  /**
   *
   */
  @inject declare goods: Goods;

  /**
   *
   */
  @inject declare fastboot: any;

  /**
   *
   */
  @tracked basket: Basket | null = null;

  /**
   *
   */
  get config(): any {
    return config.APP.goods.commerce ?? {};
  }

  get shopId(): null {
    return this.config['shopId'] ?? null;
  }

  get basketId(): string | null {
    //@ts-ignore
    return get(get(this.session, 'data'), 'basketId');
  }

  get hasBasketBalance(): boolean {
    if (isNone(this.basket)) {
      return false;
    }
    return this.basket.get('balance') > 0;
  }

  get isBasketEmpty(): boolean {
    if (isNone(this.basket)) {
      return false;
    }
    return isEmpty(this.basket.get('basketItems'));
  }

  /**
   * Format currency to a string
   * @param value
   * @returns
   */
  formatCurrency(value: number): number {
    return parseFloat((value / 100).toFixed(2));
  }

  /**
   * Build the SKU name.
   *
   * @param attributes
   * @param template
   * @returns
   */
  getSkuName(attributes: any, template: string): string {
    return Object.keys(attributes).reduce((title, key) => {
      let regex = new RegExp(`{{${key}}}`, 'gi');
      let value = attributes[key];
      if (key === 'sessionStartTime') {
        value = attributes[key][0];
        value = value.substring(0, value.length - 3);
      }
      return title.replace(regex, value);
    }, template);
  }

  /**
   * Build the variant name. Expects the `price` and 'product' relationships to
   * be populated.
   *
   * @param attributes
   * @param template
   * @returns
   */
  getVariantName(sku: Sku): string {
    let attrs = sku.get('attrs');
    let product = sku.get('product');
    let productAttrs = product.get('attrs');
    let skuName = product.get('skuName');

    let regex = new RegExp(`{{id}}`, 'gi');
    skuName = skuName.replace(regex, sku.get('id'));

    // Replace sku attrs
    skuName = Object.keys(attrs).reduce((title, key) => {
      let regex = new RegExp(`{{${key}}}`, 'gi');
      let value = attrs[key];
      if (key === 'sessionStartTime') {
        value = attrs[key][0];
        value = value.substring(0, value.length - 3);
      }
      return title.replace(regex, value);
    }, skuName);

    // Replace product attrs
    skuName = Object.keys(productAttrs).reduce((title, key) => {
      let regex = new RegExp(`{{product.${key}}}`, 'gi');
      let value = productAttrs[key];
      return title.replace(regex, value);
    }, skuName);

    return skuName;
  }

  /**
   * Initialize the commerce service by creating a basket
   */
  async initialize() {
    if (this.fastboot.get('isFastBoot')) {
      return;
    }

    this.basket = await this.loadSessionBasket();

    if (isNone(this.basket)) {
      let basket = await this.createBasket();
      this._setupBasket(basket);
    }
  }

  /**
   *
   * @returns
   */
  async loadSessionBasket(): Promise<Basket | null> {
    if (isNone(this.basketId)) {
      return null;
    }

    let baskets = await this.store.query('basket', {
      filter: {
        id: this.basketId,
        session_id: this.goods.sessionId,
      },
      include: ['basket_items.sku.product', 'basket_items.promotion'].join(','),
    });

    return baskets.get('firstObject');
  }

  /**
   *
   * @returns
   */
  async loadCountries(): Promise<Country[] | null> {
    let countries = await this.store.findAll('country');
    return countries;
  }

  /**
   *
   * @returns
   */
  async loadStates(): Promise<State[] | null> {
    let states = await this.store.findAll('state');
    return states;
  }

  /**
   *
   * @param uuid
   * @returns
   */
  async loadOrder(uuid: string): Promise<Order> {
    let orders = await this.store.query('order', {
      filter: {
        uuid: uuid,
        session_id: this.goods.sessionId,
      },
      include: [
        'order_payment_methods.shop_payment_method.payment_method',
        'payments',
        'order_lines.sku.product.brand',
        'order_lines.promotion',
      ].join(','),
    });

    return orders.get('firstObject');
  }

  /**
   *
   * @param attrs
   * @returns
   */
  createBasketItem(attrs: any): BasketItem {
    attrs.basket = this.basket;
    let basketItem = this.store.createRecord('basket-item', attrs);
    basketItem.setProperties(attrs);
    return basketItem;
  }

  /**
   *
   */
  async resetBasket() {
    let basket = await this.createBasket();
    return this._setupBasket(basket);
  }

  /**
   *
   * @returns Promise<Basket> A promise that resolves to a new basket
   */
  async createBasket(): Promise<Basket> {
    let basket = this.store.createRecord('basket', {
      shopId: this.shopId,
      sessionId: this.goods.sessionId,
    });
    await basket.save();
    return basket;
  }

  /**
   *
   * @returns An unpersisted order
   */
  createOrder(attrs: any): Order {
    let basketMetadata = this.basket?.get('metadata') ?? {};
    let attrsMetadata = attrs['metadata'] ?? {};
    let metadata = Object.assign({}, basketMetadata, attrsMetadata);
    let orderAttrs = Object.assign(
      {
        shopId: this.shopId,
        sessionId: this.goods.sessionId,
        basket: this.basket,
      },
      attrs,
      { metadata: metadata }
    );

    let order = this.store.createRecord('order', orderAttrs);
    order.setProperties(orderAttrs);

    return order;
  }

  /**
   * Create a payment for the given payment method. Does not persist the payment.
   *
   * @param order
   * @param paymentMethodName
   * @param attrs
   * @returns
   */
  createPaymentForPaymentMethod(
    order: Order,
    paymentMethodName: string,
    attrs: any = {}
  ) {
    if (isEmpty(order.get('orderPaymentMethods'))) {
      throw new Error(
        'No order payment methods in order. Please make sure that order_payment_methods.shop_payment_method.payment_method is included when loading the order and check that an payment method has been set up and added to each product in the Goods UI'
      );
    }

    let orderPaymentMethod = order
      .get('orderPaymentMethods')
      //@ts-ignore
      .findBy('shopPaymentMethod.paymentMethod.name', paymentMethodName);

    const browserDate = new Date();
    let browserTimezone = browserDate.getTimezoneOffset();

    let paymentAttrs = Object.assign(
      {
        amount: get(orderPaymentMethod, 'maxPayableAmount'),
        order: order,
        shopPaymentMethod: get(orderPaymentMethod, 'shopPaymentMethod'),
        token: '',
        challengeCompletionUrl: '',
        browserJavascriptEnabled: true,
        browserJavaEnabled: navigator.javaEnabled,
        browserColorDepth: screen.colorDepth,
        browserScreenHeight: screen.height,
        browserScreenWidth: screen.width,
        browserTimezone: browserTimezone,
        browserLanguage: navigator.language,
      },
      attrs
    );

    let payment = this.store.createRecord('payment');
    payment.setProperties(paymentAttrs);

    return payment;
  }

  /**
   * Creates and returns a payment for an order
   *
   * @param basket
   */
  async createPayment(order: Order, attrs: any = {}): Promise<Payment> {
    const browserDate = new Date();
    let browserTimezone = browserDate.getTimezoneOffset();

    let paymentAttrs = Object.assign(
      {
        amount: order.get('balance'),
        order: order,
        shopPaymentMethod: null,
        token: '',
        challengeCompletionUrl: '',
        browserJavascriptEnabled: true,
        browserJavaEnabled: navigator.javaEnabled,
        browserColorDepth: screen.colorDepth,
        browserScreenHeight: screen.height,
        browserScreenWidth: screen.width,
        browserTimezone: browserTimezone,
        browserLanguage: navigator.language,
      },
      attrs
    );

    let payment = this.store.createRecord('payment');
    payment.setProperties(paymentAttrs);

    await payment.save();

    return payment;
  }

  /**
   *
   * @param order
   * @returns
   */
  async loadOrderPaymentMethods(order: Order): Promise<OrderPaymentMethod[]> {
    return await this.store.query('order-payment-method', {
      filter: { order: order.get('id') },
    });
  }

  /**
   *
   * @param basket
   */
  _setupBasket(basket: Basket) {
    //@ts-ignore
    this.get('session').set('data.basketId', basket.get('id'));
    this.basket = basket;
  }
}

declare module '@ember/service' {
  interface Registry {
    'goods-commerce': GoodsCommerce;
  }
}
