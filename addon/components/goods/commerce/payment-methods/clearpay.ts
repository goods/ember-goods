import Component from '@glimmer/component';
import Order from 'ember-goods/models/order';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import Payment from 'ember-goods/models/payment';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import Goods from 'ember-goods/services/goods';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency';

interface GoodsCommercePaymentMethodsClearpayArgs {
  order: Order;
  orderPaymentMethod: OrderPaymentMethod;
  redirectConfirmUrl: string;
  redirectCancelUrl: string;
  paymentErrorComponent: string;
  onPaymentSuccess: (payment: Payment) => void;
}

export default class GoodsCommercePaymentMethodsClearpay extends Component<GoodsCommercePaymentMethodsClearpayArgs> {
  /**
   *
   */
  @inject declare clearpay: any;

  /**
   *
   */
  @inject declare goods: Goods;

  /**
   *
   */
  @tracked errors: any[] = [];

  /**
   *
   */
  get amount(): string {
    return (this.args.orderPaymentMethod.get('maxPayableAmount') / 100)
      .toFixed(2)
      .toString();
  }

  /**
   *
   */
  @action
  async onPayWithClearpay() {
    this.clearpay.open();

    //Create payment intent
    let payment = await this.goods.commerce.createPaymentForOrderPaymentMethod(
      this.args.order,
      this.args.orderPaymentMethod,
      {
        status: 'intent',
        metadata: {
          clearpay: {
            redirectConfirmUrl: this.args.redirectConfirmUrl,
            redirectCancelUrl: this.args.redirectCancelUrl,
            popupOriginUrl: window.location.href,
          },
        },
      }
    );

    //@ts-ignore
    let token = payment.get('metadata.clearpay.checkout.token');
    this.clearpay.process(
      token,
      () => {
        this.onSuccess(payment);
      },
      () => {
        this.onError();
      }
    );
  }

  /**
   *
   */
  onSuccess(payment: Payment) {
    //@ts-ignore
    this.capturePaymentTask.perform(payment, this.args.onPaymentSuccess);
  }

  /**
   *
   */
  onError() {}

  /**
   *
   */
  @restartableTask *capturePaymentTask(
    payment: Payment,
    onPaymentSuccess: (payment: Payment) => void
  ) {
    try {
      payment.set('capture', true);
      payment = yield payment.save();
      this.errors = [];
      onPaymentSuccess(payment);
    } catch (e) {
      this.errors = e.errors;
    }
  }
}
