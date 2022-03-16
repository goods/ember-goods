import Service from "@ember/service";

export default class GoodsPages extends Service {
  initialize() {
    //
  }
}

declare module "@ember/service" {
  interface Registry {
    "goods-pages": GoodsPages;
  }
}
