import Component from '@glimmer/component';
import Timeslot from 'ember-goods/models/timeslot-option';

interface GoodsTicketsInputDaysArgs {
  selection: Timeslot;
  days: Timeslot[];
  onShowMoreDates: () => void;
  onUpdate: (day: Timeslot) => void;
}

export default class GoodsTicketsInputDays extends Component<GoodsTicketsInputDaysArgs> {}
