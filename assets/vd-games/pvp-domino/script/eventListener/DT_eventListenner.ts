import { DT_commandID_OP, DT_GAME_STATUS_EVENT } from "./../network/DT_networkDefine";
import { _decorator, Component, Node } from "cc";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_playerInfoDataFull, DT_sendResultOnclickingThePiece } from "../model/DT_outputDataFull";
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
      case DT_commandID_OP.DT_USER_INFO:
        this.sendToDirector_initPlayerInfo(dataJson);
        break;
      case DT_commandID_OP.DT_LIST_RANDOM_LOCATION_TREASURE:
        this.sendToDirector_getListRandomLocationTreasure(dataJson);
        break;
      case DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE:
        this.sendToDirector_resultOnclickPiece(dataJson);
    }
  }
  SendToDirector_initTreasure(initTreasureData: DT_initTreaDataFull) {
    let initTreasureDataModel = DT_convertDataModel.buildInitTreasure(initTreasureData);
    console.log("initTreasureDataModel", initTreasureData);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, initTreasureDataModel);
  }
  sendToDirector_initPlayerInfo(playerInfo: DT_playerInfoDataFull) {
    let playerInfoDataModel = DT_convertDataModel.buildInitPlayerInfo(playerInfo);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, playerInfoDataModel);
  }
  sendToDirector_getListRandomLocationTreasure(listRandomLocationTreasure: DT_listRandomLocationTreasure_OP) {
    let randomListLocation = DT_convertDataModel.buildListRandomLocationTreasure(listRandomLocationTreasure);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, randomListLocation);
  }
  sendToDirector_resultOnclickPiece(dataJson: DT_sendResultOnclickingThePiece) {
    let resultOnclickPieceDataModel = DT_convertDataModel.buildResultOnclickPiece(dataJson);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, resultOnclickPieceDataModel);
  }
}
