import GoodsAdapter from "../adapters/goods";
import GoodsSerializer from "../serializers/goods";
import GoodsService from "../services/goods";
import BasketService from "../services/basket";
import ProductService from "../services/product";
import SkuService from "../services/sku";

export function initialize(application) {
  application.register("adapter:application", GoodsAdapter);
  application.register("serializer:application", GoodsSerializer);

  application.register("service:goods", GoodsService);
  application.register("service:basket", BasketService);
  application.register("service:product", ProductService);
  application.register("service:sku", SkuService);
}

export default {
  name: "goods",
  initialize
};
