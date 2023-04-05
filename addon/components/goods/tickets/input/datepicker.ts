import Component from '@glimmer/component';
import { VisitDay } from 'ember-goods/services/goods-tickets';
import { Moment } from 'moment';

interface GoodsTicketsDatepickerArgs {
  isLoading: boolean;
  days: VisitDay[];
  center: Moment;
  onChangeCenter: any;
  onSelectDay: (day: any) => void;
}

export default class GoodsTicketsDatepicker extends Component<GoodsTicketsDatepickerArgs> {}
