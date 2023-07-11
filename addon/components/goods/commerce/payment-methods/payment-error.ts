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
  get paymentMethodName(): string {
    return this.args.orderPaymentMethod
      .get('shopPaymentMethod')
      .get('paymentMethod')
      .get('name');
  }

  /**
   *
   */
  get isTescoClubcard(): boolean {
    return this.paymentMethodName === 'Tesco Clubcard';
  }

  /**
   *
   */
  get isClearpay(): boolean {
    return this.paymentMethodName === 'Clearpay';
  }
}
