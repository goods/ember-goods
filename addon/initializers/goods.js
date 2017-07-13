import GoodsAdapter from "../adapters/goods";
import GoodsSerializer from "../serializers/goods";
import BasketService from "../services/basket";
import ProductService from "../services/product";
import SkuService from "../services/sku";

export function initialize(application) {
  let config = application.get("goods");
  GoodsAdapter.reopen({
    headers: {
      Accept: "application/vnd.api+json",
      "content-type": "application/vnd.api+json;",
      Authorization: "Bearer " + config.access_token
    },
    host: config.host
  });
  application.register("adapter:application", GoodsAdapter);
  application.register("serializer:application", GoodsSerializer);
  application.register("service:basket", BasketService);
  application.register("service:product", ProductService);
  application.register("service:sku", SkuService);
}

export default {
  name: "goods",
  initialize
};
