import Component from '@glimmer/component';
import Timeslot from 'ember-goods/models/timeslot-option';
import { Moment } from 'moment';

interface GoodsTicketsDatepickerArgs {
  isLoading: boolean;
  days: Timeslot[];
  center: Moment;
  onChangeCenter: (date: Moment) => void;
  onUpdate: (day: Timeslot) => void;
}

export default class GoodsTicketsDatepicker extends Component<GoodsTicketsDatepickerArgs> {}
