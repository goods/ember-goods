import Component from '@glimmer/component';
import Order from 'ember-goods/models/order';
import config from 'ember-get-config';
import { isPresent } from '@ember/utils';
import { inject } from '@ember/service';
import moment from 'moment';
import GoodsCommerce from 'ember-goods/services/goods-commerce';

interface GoodsMetricsTrackSaleArgs {
  metrics: any;
  order: Order;
}

export default class GoodsMetricsTrackSale extends Component<GoodsMetricsTrackSaleArgs> {
  /**
   *
   */
  @inject declare commerce: GoodsCommerce;

  /**
   *
   */
  trackSale() {
    let metrics = config.APP.goods.commerce.metrics;

    if (metrics.includes('gtm')) {
      this.gtmTrackSale(this.args.order);
    }
  }

  /**
   *
   * @param order
   */
  gtmTrackSale(order: Order) {
    //@ts-ignore
    let dataLayer = window['dataLayer'] || [];

    let products: Array<any> = [];
    this.args.order.get('orderLines').forEach((orderLine) => {
      let sku = orderLine.get('sku');
      let skuName = this.commerce.getSkuName(
        sku.get('attrs'),
        sku.get('product').get('skuName')
      );
      let bookableDate = '';
      if (isPresent(sku.get('attrs').bookableDate)) {
        bookableDate = moment(sku.get('attrs').bookableDate).format(
          'YYYY-MM-DD'
        );
      }
      products.push({
        name: sku.get('product').get('name'),
        id: sku.get('id'),
        price: orderLine.get('price') / 100,
        brand: sku.get('product').get('brand').get('name'),
        category: 'Ticket',
        quantity: orderLine.get('quantity'),
        variant: skuName,
        dimension1: bookableDate,
        dimension2: sku.get('attrs').sessionStartTime,
      });
    });

    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      ecommerce: {
        purchase: {
          actionField: {
            id: order.get('id'),
            affiliation: 'Online Store',
            revenue: order.get('total') / 100,
            tax: '0',
            shipping: '0',
          },
          products,
        },
      },
    });
  }

  constructor(owner: any, args: any) {
    super(owner, args);
    this.trackSale();
  }
}
