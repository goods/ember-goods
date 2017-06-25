import Ember from 'ember';
const { RSVP, Service, computed: {alias}, inject, isNone, get, set } = Ember;

export default Service.extend({
  
  store: inject.service(),
  basket: null,

  basketItems: alias('basket.basketItems'),
  total: alias('basket.total'),
  quantity: alias('basket.quantity'),

  createBasket() {
    return get(this, 'store')
    .createRecord('basket')
    .save();
  },

  getBasket(basketId) {
    return get(this, 'store')
    .find('basket', basketId);
  },

  createBasketItem(basketItems, sku, quantity) {
    const store = get(this, 'store');
    let basketItem = store.createRecord('basketItem', {
      basket: null,
      quantity: quantity,
      sku: sku,
      price: get(sku, 'price'),
    });
    if (isNone(basketItems) === false) {
      basketItems.pushObject(basketItem);
    }
    return basketItem;
  },

  destroyBasketItem(basketItems, basketItem) {
    if (isNone(basketItems) === false) {
      basketItems.removeObject(basketItem);
    }
    if (basketItem.get('isDeleted')) {
      return;
    }
    return basketItem.destroyRecord()
    .then(this._reloadBasket.bind(this));
  },

  saveBasketItem(basketItem) {
    return basketItem.save();
  },

  setBasketItemQuantity(basketItem, quantity) {
    set(basketItem, 'quantity', quantity);
  },

  addToBasket(basketItems) {
    if (isNone(get(this, 'basket'))) {
      console.error("There isn't a basket to add the items to. Create a basket instance and then set it on the basket service (preferably in an initializer) before adding items to it.");
      return;
    }
    let unsavedBasketItems = basketItems
    .filterBy('isNew')
    .filterBy('isSaving', false);
    unsavedBasketItems.setEach('basket', get(this, 'basket'));
    return RSVP.all(unsavedBasketItems.invoke('save'))
    .then(this._reloadBasket.bind(this));
  },

  _reloadBasket() {
    return get(this, 'basket').reload();
  },

  createOrder(order) {
    return order.save();
  }

});
