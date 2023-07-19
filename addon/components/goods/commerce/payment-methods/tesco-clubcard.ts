import Component from '@glimmer/component';
import Order from 'ember-goods/models/order';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import Payment from 'ember-goods/models/payment';
import Goods from 'ember-goods/services/goods';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { restartableTask } from 'ember-concurrency';

interface GoodsCommercePaymentMethodsTescoClubcardArgs {
  order: Order;
  orderPaymentMethod: OrderPaymentMethod;
  paymentErrorComponent: string;
  onPaymentSuccess: (payment: Payment) => void;
}

export default class GoodsCommercePaymentMethodsTescoClubcard extends Component<GoodsCommercePaymentMethodsTescoClubcardArgs> {
  /**
   *
   */
  @inject declare goods: Goods;

  /**
   *
   */
  @tracked payment: Payment | null = null;

  /**
   *
   */
  @tracked errors: any[] = [];

  /**
   *
   */
  get isInvalid(): boolean {
    let token = this.payment?.get('token') ?? '';
    return isEmpty(token) || token.length < 6;
  }

  /**
   *
   */
  get isCreatingPayment(): boolean {
    //@ts-ignore
    return this.createPaymentTask.isRunning;
  }

  /**
   *
   */
  @action
  onSubmit(payment: Payment) {
    //@ts-ignore
    this.createPaymentTask.perform(payment, this.args.onPaymentSuccess);
  }

  /**
   *
   */
  @restartableTask *createPaymentTask(
    payment: Payment,
    onPaymentSuccess: (payment: Payment) => void
  ) {
    try {
      payment = yield payment.save();
      this.errors = [];
      onPaymentSuccess(payment);
      this.setupPayment();
    } catch (e) {
      this.errors = e.errors;
    }
  }

  /**
   *
   */
  setupPayment() {
    let payment = this.goods.commerce.preparePayment(this.args.order);

    payment.setProperties({
      amount: 0,
      shopPaymentMethod: this.args.orderPaymentMethod.get('shopPaymentMethod'),
      token: '',
      capture: false,
    });

    this.payment = payment;
  }

  /**
   *
   * @param owner
   * @param args
   */
  constructor(owner: any, args: GoodsCommercePaymentMethodsTescoClubcard) {
    super(owner, args);
    this.setupPayment();
  }
}
