import Service from '@ember/service';
import { isNone } from '@ember/utils';
import { inject } from '@ember/service';
import GoodsCommerce from './goods-commerce';
import Sku from 'ember-goods/models/sku';
import Product from 'ember-goods/models/product';
import { Visitor } from 'tickets';

export default class GoodsTickets extends Service {
  /**
   *
   */
  @inject('goods-commerce') declare commerce: GoodsCommerce;

  /**
   *
   * @param product
   * @param skus
   * @param selection
   */
  getVisitors(product: Product, skus: Sku[], selection: any): Visitor[] {
    let visitors: Visitor[] = [];
    if (isNone(selection)) {
      selection = [];
    }

    skus.forEach((sku: Sku) => {
      let name = this.commerce.getVariantName(sku);
      let age = sku.get('attrs').age;

      let visitor = visitors.find((row: any) => row['name'] == name);
      let price = sku.get('price').get('value');
      let quantity = 0;

      let existingSelection = selection.find((row: any) => row['name'] == name);
      if (!isNone(existingSelection)) {
        quantity = existingSelection.quantity;
      }

      if (isNone(visitor)) {
        visitors.pushObject({
          name,
          age,
          price,
          quantity: quantity,
          isFrom: false,
        });
      } else {
        if (price < visitor.price) {
          visitor.price = price;
          visitor.isFrom = true;
        }
      }
    }, visitors);
    return visitors;
  }

  /**
   *
   * @param skus
   */
  groupByDay(skus: Sku[]) {
    return skus.reduce((days: any, sku) => {
      let day = days.findBy('date', sku.get('attrs').bookableDate);

      if (isNone(day)) {
        days.pushObject({
          date: sku.get('attrs').bookableDate,
          skus: [sku],
        });
      } else {
        day.skus.pushObject(sku);
      }
      return days;
    }, []);
  }

  /**
   *
   * @param skus
   * @returns
   */
  groupBySession(skus: Sku[]) {
    return skus.reduce((sessions: any, sku) => {
      let startTime = sku.get('attrs').sessionStartTime;
      let finishTime = sku.get('attrs').sessionFinishTime;

      let session = sessions.find(
        (session: any) =>
          session.startTime == startTime && session.finishTime == finishTime
      );

      if (isNone(session)) {
        sessions.pushObject({
          startTime: startTime,
          finishTime: finishTime,
          stockQuantity: sku.get('stockQuantity'),
          skus: [sku],
        });
      } else {
        session.skus.pushObject(sku);
      }
      return sessions;
    }, []);
  }

  /**
   * Returns false if any of the visitors are unable to be allocated to quantity
   * available on a SKU. If the SKUs use sessions they will be grouped by
   * session and the total session quantity will be taken into account.
   *
   * @param skus
   * @param visitors
   * @returns
   */
  hasCapacity(skus: Sku[], visitors: any): boolean {
    let sessions = this.groupBySession(skus);

    return sessions.any((session: any) => {
      if (isNone(session.startTime) && isNone(session.finishTime)) {
        //Check by sku name
        return visitors.every((visitor: Visitor) => {
          let sku = session.skus.find((sku: Sku) => {
            let skuName = this.commerce.getVariantName(sku);
            return skuName == visitor.name;
          });

          if (isNone(sku) || visitor.quantity > sku.get('stockQuantity')) {
            return false;
          }
          return true;
        });
      } else {
        //Check by session total
        let requiredQuantity = visitors.reduce(
          (requiredQuantity: number, visitor: any) =>
            requiredQuantity + visitor.quantity,
          0
        );
        return requiredQuantity <= session.stockQuantity;
      }
    });
  }

  /**
   * Matches visitors to the SKUs by name and uses that to calculate and return
   * the total price. Throws if a match cannot be found.
   * @param skus
   * @param visitors
   */
  getPrice(skus: Sku[], visitors: any): number {
    return visitors.reduce((price: number, visitor: Visitor) => {
      let sku = skus.find((sku: Sku) => {
        let skuName = this.commerce.getVariantName(sku);
        return skuName == visitor.name;
      });

      if (isNone(sku)) {
        throw `Attempted to get total price but visitor with the name '${visitor.name}' was not found in the list of SKUs`;
      }

      return price + sku.get('price').get('value') * visitor.quantity;
    }, 0);
  }

  /**
   *
   * @param skus
   * @param visitors
   */
  matchSkusToVisitors(skus: Sku[], visitors: any) {
    return visitors.map((visitor: Visitor) => {
      let sku = skus.find((sku: Sku) => {
        let skuName = this.commerce.getVariantName(sku);
        return skuName == visitor.name;
      });

      if (isNone(sku)) {
        throw `Attempted to match visitor to SKUs but a SKU with the name '${visitor.name}' was not found`;
      }

      return sku;
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'goods-tickets': GoodsTickets;
  }
}
