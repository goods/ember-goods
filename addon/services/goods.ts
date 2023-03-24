import Service from '@ember/service';
import { get, set } from '@ember/object';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { isNone } from '@ember/utils';
import RSVP from 'rsvp';
import Basket from '../models/basket';
import BasketItem from '../models/basket-item';
import Order from '../models/order';
import Payment from '../models/payment';
import Sku from '../models/sku';
import GoodsCommerce from './goods-commerce';
//@ts-ignore
import { Store } from '@ember-data/store';
//@ts-ignore
import config from 'ember-get-config';
import { all } from 'rsvp';
import Session from './session';
//@ts-ignore
import { v4 } from 'ember-uuid';
//@ts-ignore
import GoodsMetrics from './goods-metrics';
import GoodsTickets from './goods-tickets';

export default class Goods extends Service {
  @inject declare session: Session;
  @inject declare store: Store;

  @inject('goods-commerce') declare commerce: GoodsCommerce;
  @inject('goods-metrics') declare metrics: GoodsMetrics;
  @inject('goods-tickets') declare tickets: GoodsTickets;

  @alias('basket.basketItems') declare basketItems: BasketItem[];

  /**
   * Default commerce config
   */
  commerceConfig: any = Object.assign(
    {},
    {
      enabled: false,
      metrics: [],
    },
    config.APP.goods.commerce
  );

  /**
   * Default metrics config
   */
  metricsConfig: any = Object.assign(
    {},
    {
      enabled: false,
    },
    config.APP.goods.metrics
  );

  /**
   *
   */
  async initialize() {
    let promises: Promise<any>[] = [];
    if (this.commerceConfig.enabled == true) {
      promises.push(this.commerce.initialize());
    }

    if (this.metricsConfig.enabled == true) {
      promises.push(this.metrics.initialize());
    }

    //@ts-ignore
    let sessionId = this.session.get('data.sessionId');

    if (isNone(sessionId)) {
      let uuid = v4();
      //@ts-ignore
      this.session.set('data.sessionId', uuid);
    }

    await all(promises);
  }

  get sessionId() {
    //@ts-ignore
    return this.session.get('data.sessionId');
  }

  public async createBasket(): Promise<Basket> {
    return await this.store.createRecord('basket').save();
  }

  public async getBasket(basketId: string): Promise<Basket | null> {
    return await this.store.findRecord('basket', basketId, {
      include: 'basketItems.sku.product.brand',
    });
  }

  public createBasketItem(
    basketItems: BasketItem[],
    sku: Sku,
    quantity: number,
    metadata: any = null,
    isHidden: boolean = false
  ): BasketItem {
    const store = this.store;
    let basketItem = store.createRecord('basketItem', {
      basket: null,
      quantity: quantity,
      sku: sku,
      price: get(sku, 'price'),
      metadata: metadata,
      isHidden: isHidden,
    });
    if (isNone(basketItems) === false) {
      //@ts-ignore
      basketItems.pushObject(basketItem);
    }
    return basketItem;
  }

  public async destroyBasketItem(
    basketItems: BasketItem[],
    targetBasketItem: BasketItem
  ): Promise<void> {
    return this.destroyBasketItems(basketItems, [targetBasketItem]);
  }

  public async destroyBasketItems(
    _basketItems: BasketItem[],
    targetBasketItems: BasketItem[]
  ): Promise<void> {
    //@ts-ignore
    let baskets = targetBasketItems.mapBy('basket.content').uniq();

    this.metrics.trackRemoveFromBasket(targetBasketItems);

    await all(
      targetBasketItems.map((basketItem) => {
        basketItem.deleteRecord();
        return basketItem.save();
      })
    );

    await RSVP.all(baskets.invoke('reload'));
  }

  public async removePromotion(
    basket: Basket,
    promotionLine: BasketItem
  ): Promise<void> {
    await promotionLine.destroyRecord();
    await basket.reload();
  }

  public async saveBasketItem(basketItem: BasketItem): Promise<BasketItem> {
    return basketItem.save();
  }

  public setBasketItemQuantity(basketItem: BasketItem, quantity: number): void {
    set(basketItem, 'quantity', quantity);
  }

  public async addToBasket(
    basketItems: BasketItem[],
    basket: Basket
  ): Promise<void> {
    let unsavedBasketItems = basketItems
      //@ts-ignore
      .filterBy('isNew')
      .filterBy('isSaving', false);
    unsavedBasketItems.setEach('basket', basket);

    await unsavedBasketItems.reduce(function (
      previous: any,
      basketItem: BasketItem
    ) {
      return previous.then(basketItem.save.bind(basketItem));
    },
    RSVP.resolve());

    if (this.metricsConfig.enabled) {
      this.metrics.trackAddToBasket(unsavedBasketItems);
    }

    await basket.reload();
  }

  public async createOrder(order: Order): Promise<Order> {
    return order.save();
  }

  public createPayment(order: Order): Payment {
    const store = this.store;
    //@ts-ignore
    const orderPaymentMethod = get(order, 'orderPaymentMethods.firstObject');
    return store.createRecord('payment', {
      amount: get(orderPaymentMethod, 'maxPayableAmount'),
      order: order,
      shopPaymentMethod: get(orderPaymentMethod, 'shopPaymentMethod'),
      token: '',
    });
  }

  public fieldsToHash(fields: any): any {
    return fields.reduce((fieldHash: any, field: any) => {
      fieldHash[get(field, 'slug')] = get(field, 'values');
      return fieldHash;
    }, []);
  }

  public getFieldValue(record: any, reference: string): any {
    let field = get(record, 'skuFields').find(
      (field: any) => get(field, 'slug') === reference
    );
    if (isEmpty(field)) {
      throw new Error(
        `SKU field with the reference ${reference} not found in record with ID ${record.id}`
      );
    }
    return field.get('values.firstObject');
  }

  public attributesToHash(attributes: any): any {
    return attributes.reduce((attributeHash: any, attribute: any) => {
      //@ts-ignore
      attributeHash[get(attribute, 'slug')] = get(attribute, 'values');
      return attributeHash;
    }, []);
  }

  public getAttributeValue(attributes: any, identifier: string): any {
    let attribute = attributes.find(
      (attribute: any) => get(attribute, 'slug') === identifier
    );

    if (isEmpty(attribute)) {
      throw new Error(
        `Attribute with the reference ${identifier} not found in attribute list`
      );
    }

    return get(attribute, 'values');
  }
}

declare module '@ember/service' {
  interface Registry {
    goods: Goods;
  }
}
