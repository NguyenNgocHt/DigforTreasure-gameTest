import { mock_treasureOpen } from "./../../../../vd-mock/mock_config";
import { StartScene } from "./../../../../vd-boot/StartScene";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { _decorator, Component, Node, director } from "cc";
import { DT_GAME_STATUS_EVENT } from "../network/DT_networkDefine";
const { ccclass, property } = _decorator;

@ccclass("DigTreasureControler")
export class DigTreasureControler extends Component {
  private static _instance: DigTreasureControler = null!;

  public static get instance(): DigTreasureControler {
    if (this._instance == null) {
      this._instance = new DigTreasureControler();
    }

    return this._instance;
  }
  start() {
    // this.scheduleOnce(function () {
    //   this.InitTreasure();
    // }, 0.1);
  }
  public InitTreasure() {
    let treasureData = mock_treasureOpen;
    console.log("treasureData", treasureData);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, treasureData);
  }
}
