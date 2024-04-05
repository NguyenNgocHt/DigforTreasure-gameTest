import { _decorator, Component, Node } from "cc";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../network/NetworkDefine";
VDEventListener;
const { ccclass, property } = _decorator;

@ccclass("SendDataToSever")
export class SendDataToSever extends Component {
  private static _instance: SendDataToSever = null!;

  public static get instance(): SendDataToSever {
    if (this._instance == null) {
      this._instance = new SendDataToSever();
    }

    return this._instance;
  }
  RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.DIRECTOR_TO_SEND_DATA_SEVER, this.convertDataAndSendToSever.bind(this));
  }

  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.DIRECTOR_TO_SEND_DATA_SEVER, this.convertDataAndSendToSever.bind(this));
  }

  convertDataAndSendToSever(data) {
    let msgData = JSON.stringify(data);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, msgData);
  }
}
