import { DT_commandID_OP, DT_GAME_STATUS_EVENT } from "./../network/DT_networkDefine";
import { _decorator, Component, Node } from "cc";
import { DigTreasureControler } from "../common/DigTreasureControler";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_initTreaDataFull } from "../model/DT_outputDataFull";
import { DT_convertDataModel } from "../model/DT_convertDataModel";
const { ccclass, property } = _decorator;

@ccclass("DT_eventListenner")
export class DT_eventListenner extends Component {
  private static _instance: DT_eventListenner = null!;

  public static get instance(): DT_eventListenner {
    if (this._instance == null) {
      this._instance = new DT_eventListenner();
    }

    return this._instance;
  }
  start() {
    // this.RegisterEvent();
  }
  public RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.GetDataFromSever.bind(this));
  }
  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.GetDataFromSever.bind(this));
  }
  GetDataFromSever(data) {
    console.log("data", data);
    let dataJson = data;
    let dataID = data.ID;
    switch (dataID) {
      case DT_commandID_OP.DT_INIT_TREASURE_START_GAME:
        this.SendToDirector_initTreasure(dataJson);
        break;
    }
  }
  SendToDirector_initTreasure(initTreasureData: DT_initTreaDataFull) {
    let initTreasureDataModel = DT_convertDataModel.buildInitTreasure(initTreasureData);
    console.log("initTreasureDataModel", initTreasureData);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, initTreasureDataModel);
  }
}
