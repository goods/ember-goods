import Component from "@ember/component";
// @ts-ignore: Ignore import of compiled template
import template from "./template";
import { notEmpty } from "@ember-decorators/object/computed";
import { computed } from "@ember-decorators/object";
import { get } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { isNone } from "@ember/utils";
import { layout } from "@ember-decorators/component";

@layout(template)
export default class PaymentChallenge extends Component {
  payment!: any;

  @notEmpty("payment.challengeUrl") isChallengingPayment!: boolean;
  @computed("payment.challengeRequest")
  get challengeRequest() {
    return Object.entries(get(this.payment, "challengeRequest"));
  }

  renderIframeContent() {
    scheduleOnce("afterRender", this, () => {
      let iframeEl: any = document.getElementById(
        "goods-payment-challenge-frame"
      );
      scheduleOnce("afterRender", this, () => {
        if (!isNone(iframeEl)) {
          let doc = iframeEl.contentWindow.document;

          let formHtml = `<form action=${this.payment.challengeUrl} method="post">`;
          this.challengeRequest.forEach(param => {
            formHtml += `<input type="hidden" name=${param[0]} value=${param[1]} >`;
          });
          formHtml += `
            <input id="challenge-frame-trigger" type="submit" value="Go" style="visibility: hidden;">
          </form>
        `;
          doc.open();
          doc.write(formHtml);
          doc.close();

          doc.getElementById("challenge-frame-trigger").click();
        }
      });
    });
  }

  didReceiveAttrs() {
    this.renderIframeContent();
  }
}
