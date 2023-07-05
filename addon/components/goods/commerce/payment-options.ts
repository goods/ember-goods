import Component from '@glimmer/component';
import { action } from '@ember/object';
import Order from 'ember-goods/models/order';
import { tracked } from '@glimmer/tracking';
import { isNone } from '@ember/utils';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import Payment from 'ember-goods/models/payment';

interface GoodsCommercePaymentOptionsArgs {
  order: Order;
  challengeSuccessUrl: string;
  challengeFailedUrl: string;
  paymentErrorComponent: string;
  onOrderFullyPaid: (order: Order) => void;
}

export default class GoodsCommercePaymentOptions extends Component<GoodsCommercePaymentOptionsArgs> {
  /**
   *
   */
  @tracked selected: OrderPaymentMethod | null = null;

  /**
   *
   */
  @tracked lastSuccessfulPayment: Payment | null = null;

  /**
   *
   */
  get paymentErrorComponent(): string {
    return (
      this.args.paymentErrorComponent ??
      'goods/commerce/payment-methods/payment-error'
    );
  }

  /**
   *
   */
  get orderPaymentMethods(): OrderPaymentMethod[] {
    return this.args.order
      .get('orderPaymentMethods')
      .filter((orderPaymentMethod: OrderPaymentMethod) => {
        return orderPaymentMethod.get('maxPayableAmount') > 0;
      })
      .sortBy('shopPaymentMethod.isDefault')
      .reverse();
  }

  /**
   *
   */
  get hasMultiplePaymentOptions(): boolean {
    return this.orderPaymentMethods.length > 1;
  }

  /**
   *
   */
  get selectedPaymentMethodComponent(): string | undefined {
    let name = this.selected
      ?.get('shopPaymentMethod')
      .get('paymentMethod')
      .get('name');

    if (isNone(name)) {
      return undefined;
    }

    if (name == 'Sagepay Direct') {
      return 'goods/commerce/payment-methods/sagepay-direct';
    }
    if (name == 'Tesco Clubcard') {
      return 'goods/commerce/payment-methods/tesco-clubcard';
    }

    return 'goods/commerce/payment-methods/unsupported';
  }

  /**
   *
   */
  resetSelected() {
    const orderPaymentMethod = this.orderPaymentMethods.find(
      (orderPaymentMethod) =>
        orderPaymentMethod.get('shopPaymentMethod').get('isDefault')
    );

    if (orderPaymentMethod) {
      this.selected = orderPaymentMethod;
    }
  }

  /**
   *
   * @param orderPaymentMethod
   */
  @action
  onSelectOrderPaymentMethod(orderPaymentMethod: OrderPaymentMethod) {
    this.selected = orderPaymentMethod;
  }

  /**
   *
   * @param payment
   */
  @action
  onPaymentSuccess(payment: Payment) {
    const balance = payment.get('order').get('balance');
    if (balance <= 0) {
      this.args.onOrderFullyPaid(payment.get('order'));
    } else {
      this.lastSuccessfulPayment = payment;

      if (
        payment.get('shopPaymentMethod').get('paymentMethod').get('name') ===
        'Tesco Clubcard'
      ) {
        this.resetSelected();
      }
    }
  }

  /**
   *
   * @param owner
   * @param args
   */
  constructor(owner: any, args: GoodsCommercePaymentOptionsArgs) {
    super(owner, args);

    if (this.args.order.get('balance') <= 0) {
      this.args.onOrderFullyPaid(this.args.order);
    }

    this.resetSelected();
  }
}
