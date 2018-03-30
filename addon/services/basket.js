/* eslint no-console:0 */
import RSVP from 'rsvp';

import Service, { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import { set, get } from '@ember/object';

export default Service.extend({
  store: service(),

  createBasket() {
    return get(this, "store")
      .createRecord("basket")
      .save();
  },

  getBasket(basketId) {
    return get(this, "store").find("basket", basketId);
  },

  createBasketItem(
    basketItems,
    sku,
    quantity,
    metadata = null,
    isHidden = false
  ) {
    const store = get(this, "store");
    let basketItem = store.createRecord("basketItem", {
      basket: null,
      quantity: quantity,
      sku: sku,
      price: get(sku, "price"),
      metadata: metadata,
      isHidden: isHidden
    });
    if (isNone(basketItems) === false) {
      basketItems.pushObject(basketItem);
    }
    return basketItem;
  },

  destroyBasketItems(basketItems, targetBasketItems) {
    if (isNone(basketItems) === false) {
      basketItems.removeObjects(targetBasketItems);
    }

    return RSVP.all(targetBasketItems.invoke("destroyRecord")).then(
      this._reloadBasket.bind(this)
    );
  },

  destroyBasketItem(basketItems, basketItem) {
    if (isNone(basketItems) === false) {
      basketItems.removeObject(basketItem);
    }
    if (basketItem.get("isDeleted")) {
      return;
    }
    return basketItem.destroyRecord().then(this._reloadBasket.bind(this));
  },

  saveBasketItem(basketItem) {
    return basketItem.save();
  },

  setBasketItemQuantity(basketItem, quantity) {
    set(basketItem, "quantity", quantity);
  },

  addToBasket(basketItems) {
    let unsavedBasketItems = basketItems
      .filterBy("isNew")
      .filterBy("isSaving", false);
    unsavedBasketItems.setEach("basket", get(this, "basket"));
    return RSVP.all(unsavedBasketItems.invoke("save")).then(
      this._reloadBasket.bind(this)
    );
  },

  createOrder(order) {
    return order.save();
  }
});
