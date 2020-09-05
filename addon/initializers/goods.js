import GoodsAdapter from "../adapters/goods";
import GoodsSerializer from "../serializers/goods";
import GoodsService from "../services/goods";

export function initialize(application) {
  application.register("adapter:application", GoodsAdapter);
  application.register("serializer:application", GoodsSerializer);

  application.register("service:goods", GoodsService);
}

export default {
  name: "goods",
  initialize,
};
