/* eslint no-console:0 */
import Service, { inject as service } from "@ember/service";
import { alias } from "@ember/object/computed";
import { isNone } from "@ember/utils";
import { set, get } from "@ember/object";
import RSVP from "rsvp";

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

  async destroyBasketItems(basketItems, targetBasketItems) {
    if (isNone(basketItems) === false) {
      basketItems.removeObjects(targetBasketItems);
    }

    let baskets = basketItems.mapBy("basket.content").uniq();

    await RSVP.all(targetBasketItems.invoke("destroyRecord"));
    await RSVP.all(baskets.invoke("reload"));
  },

  async destroyBasketItem(basketItems, basketItem) {
    let basket = get(basketItem, "basket.content");

    if (isNone(basketItems) === false) {
      basketItems.removeObject(basketItem);
    }
    if (basketItem.get("isDeleted")) {
      return;
    }
    await basketItem.destroyRecord();
    await basket.reload();
  },

  saveBasketItem(basketItem) {
    return basketItem.save();
  },

  setBasketItemQuantity(basketItem, quantity) {
    set(basketItem, "quantity", quantity);
  },

  async addToBasket(basketItems, basket) {
    let unsavedBasketItems = basketItems
      .filterBy("isNew")
      .filterBy("isSaving", false);
    unsavedBasketItems.setEach("basket", basket);

    await RSVP.all(unsavedBasketItems.invoke("save"));
    await basket.reload();
  },

  createOrder(order) {
    return order.save();
  }
});
