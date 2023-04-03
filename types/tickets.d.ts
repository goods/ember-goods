import Sku from 'ember-goods/models/sku';
//@ts-ignore
import { Moment } from 'moment';

export type VisitDayStatus = 'available' | 'unavailable';

export interface VisitDay {
  skus: Sku[];
  date: Moment;
  price: number;
  isSelected: boolean;
  status: VisitDayStatus;
}

export interface Visitor {
  name: string;
  age: string;
  price: number;
  quantity: number;
  isFrom: boolean;
}
