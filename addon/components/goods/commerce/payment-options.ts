import Component from '@glimmer/component';
import { action } from '@ember/object';
import Order from 'ember-goods/models/order';
import { tracked } from '@glimmer/tracking';
import { isNone } from '@ember/utils';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import Payment from 'ember-goods/models/payment';

interface GoodsCommercePaymentOptionsArgs {
  /* The order to pay for */
  order: Order;

  /* If the payment is challenged (e.g. 3D secure) the user will be redirected
  to this URL if they pass the challenge */
  challengeSuccessUrl: string;

  /* If the payment is challenged (e.g. 3D secure) the user will be redirected
  to this URL if they fail the challenge */
  challengeFailedUrl: string;

  /* If the payment is completed externally (e.g. a modal popup or iframe) the
  user will be redirected to this URL if they confirm the payment */
  redirectConfirmUrl: string;

  /* If the payment is completed externally (e.g. a modal popup or iframe) the
  user will be redirected to this URL if they cancel the payment */
  redirectCancelUrl: string;

  /* Custom component to show the error messages */
  paymentErrorComponent: string;

  /* Callback when the order is successfully fully paid */
  onOrderFullyPaid: (order: Order) => void;

  /* Error from the payment provider that are passed via query params */
  queryParamError: string;
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
    if (name == 'Clearpay') {
      return 'goods/commerce/payment-methods/clearpay';
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
