import Component from '@glimmer/component';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import Payment from 'ember-goods/models/payment';
import { isNone } from '@ember/utils';
import Order from 'ember-goods/models/order';

interface GoodsCommercePaymentMethodsPaymentSuccessArgs {
  order: Order;
  payment: Payment;
  orderPaymentMethods: OrderPaymentMethod[];
}

export default class GoodsCommercePaymentMethodsPaymentSuccess extends Component<GoodsCommercePaymentMethodsPaymentSuccessArgs> {
  /**
   *
   */
  get isTescoClubcard(): boolean {
    return (
      this.args.payment
        .get('shopPaymentMethod')
        .get('paymentMethod')
        .get('name') === 'Tesco Clubcard'
    );
  }

  /**
   *
   */
  get balance(): number {
    return this.args.order.get('balance');
  }

  /**
   *
   */
  get hasDifferentTescoBalance() {
    return this.balance !== this.tescoBalance;
  }

  /**
   *
   */
  get tescoBalance(): number {
    let tescoClubcardPaymentMethod = this.args.orderPaymentMethods.find(
      (orderPaymentMethod: OrderPaymentMethod) => {
        return (
          orderPaymentMethod
            .get('shopPaymentMethod')
            .get('paymentMethod')
            .get('name') === 'Tesco Clubcard'
        );
      }
    );

    if (!isNone(tescoClubcardPaymentMethod)) {
      return tescoClubcardPaymentMethod.get('maxPayableAmount');
    }
    return 0;
  }

  /**
   *
   */
  get hasTescoBalance(): boolean {
    return this.tescoBalance > 0;
  }
}
