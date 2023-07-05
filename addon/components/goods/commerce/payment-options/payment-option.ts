import Component from '@glimmer/component';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import { dasherize } from '@ember/string';

interface GoodsCommercePaymentOptionsPaymentOptionArgs {
  orderPaymentMethod: OrderPaymentMethod;
  selected: OrderPaymentMethod | null;
  onSelectOrderPaymentMethod: (orderPaymentMethod: OrderPaymentMethod) => void;
}

export default class GoodsCommercePaymentOptionsPaymentOption extends Component<GoodsCommercePaymentOptionsPaymentOptionArgs> {
  get paymentMethodName(): string {
    /**
     *
     */
    return this.args.orderPaymentMethod
      .get('shopPaymentMethod')
      .get('paymentMethod')
      .get('name');
  }

  /**
   *
   */
  get isCardPayment(): boolean {
    return this.paymentMethodName == 'Sagepay Direct';
  }
}
