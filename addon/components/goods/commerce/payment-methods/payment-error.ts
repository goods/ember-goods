import Component from '@glimmer/component';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';

interface GoodsCommercePaymentMethodsPaymentErrorArgs {
  errors: any[];
  orderPaymentMethod: OrderPaymentMethod;
}

export default class GoodsCommercePaymentMethodsPaymentError extends Component<GoodsCommercePaymentMethodsPaymentErrorArgs> {
  /**
   *
   */
  get isTescoClubcard(): boolean {
    return (
      this.args.orderPaymentMethod
        .get('shopPaymentMethod')
        .get('paymentMethod')
        .get('name') === 'Tesco Clubcard'
    );
  }
}
