import Component from '@glimmer/component';
import { action } from '@ember/object';
import Order from 'ember-goods/models/order';
import Payment from 'ember-goods/models/payment';
import OrderPaymentMethod from 'ember-goods/models/order-payment-method';
import moment from 'moment';
import Goods from 'ember-goods/services/goods';
import { inject } from '@ember/service';
import { isEmpty, isNone } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency';
import creditCardType from 'ember-goods/utils/credit-card';

interface GoodsCommercePaymentMethodsSagepayDirectArgs {
  order: Order;
  orderPaymentMethod: OrderPaymentMethod;
  challengeSuccessUrl: string;
  challengeFailedUrl: string;
  paymentErrorComponent: string;
  queryParamError: string;
  onPaymentSuccess: (payment: Payment) => void;
}

export default class GoodsCommercePaymentMethodsSagepayDirect extends Component<GoodsCommercePaymentMethodsSagepayDirectArgs> {
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
  @tracked expiryMonth: string = '';

  /**
   *
   */
  @tracked expiryYear: string = '';

  /**
   *
   */
  @tracked responseErrors: any[] = [];

  /**
   *
   */
  get errors(): any[] {
    if (this.responseErrors.length > 0) {
      return this.responseErrors;
    } else if (!isEmpty(this.args.queryParamError)) {
      return [{ title: this.args.queryParamError }];
    }
    return [];
  }

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
  get expiryDate(): string {
    let expiryYear = this.expiryYear;
    if (!isNone(expiryYear)) {
      expiryYear = expiryYear.slice(-2);
    }
    return this.expiryMonth + expiryYear;
  }

  /**
   *
   */
  get cardType(): string {
    let cardNumber = this.payment?.get('cardNumber') ?? '';
    if (isEmpty(cardNumber)) {
      return '';
    }
    cardNumber = cardNumber.replace(/\s+/g, '');
    //@ts-ignore
    let cardType: string = creditCardType(cardNumber);
    return cardType;
  }

  /**
   *
   */
  get isInvalid(): boolean {
    return (
      isEmpty(this.payment?.get('cardNumber')) ||
      isEmpty(this.payment?.get('cardholder')) ||
      isEmpty(this.expiryDate) ||
      isEmpty(this.payment?.get('cvv'))
    );
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
      payment.set('expiryDate', this.expiryDate);
      payment.set('cardType', this.cardType);
      payment = yield payment.save();
      this.responseErrors = [];
      onPaymentSuccess(payment);
    } catch (e) {
      this.responseErrors = e.errors;
    }
  }

  /**
   *
   * @param owner
   * @param args
   */
  constructor(owner: any, args: GoodsCommercePaymentMethodsSagepayDirectArgs) {
    super(owner, args);

    let payment = this.goods.commerce.preparePayment(this.args.order);

    payment.setProperties({
      amount: this.args.orderPaymentMethod.get('maxPayableAmount'),
      shopPaymentMethod: this.args.orderPaymentMethod.get('shopPaymentMethod'),
      token: '',
      challengeCompletionUrl: '',
      browserJavascriptEnabled: true,
      browserJavaEnabled: navigator.javaEnabled,
      browserColorDepth: screen.colorDepth,
      browserScreenHeight: screen.height,
      browserScreenWidth: screen.width,
      browserTimezone: moment().utcOffset(),
      browserLanguage: navigator.language,
      challengeSuccessUrl: this.args.challengeSuccessUrl,
      challengeFailedUrl: this.args.challengeFailedUrl,
    });

    this.payment = payment;
  }
}
