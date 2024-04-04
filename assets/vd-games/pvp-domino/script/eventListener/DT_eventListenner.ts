import { DT_commandID_OP, DT_GAME_STATUS_EVENT } from "./../network/DT_networkDefine";
import { _decorator, Component, Node } from "cc";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_playerInfoDataFull, DT_recordPlayersList, DT_sendResultOnclickingThePiece } from "../model/DT_outputDataFull";
import { DT_convertDataModel } from "../model/DT_convertDataModel";
import { I_buildDataModel } from "../common/dt_interfaceDefine";
const { ccclass, property } = _decorator;

@ccclass("DT_eventListenner")
export class DT_eventListenner extends Component {
  constructor(dataModel: I_buildDataModel) {
    super();
    this.i_buildDataModel = dataModel;
  }
  startingTime: number = 0;
  started: boolean = false;
  private static _instance: DT_eventListenner = null!;
  private i_buildDataModel: I_buildDataModel;
  public static get instance(): DT_eventListenner {
    if (this._instance == null) {
      let buildDataModel = new DT_convertDataModel();
      this._instance = new DT_eventListenner(buildDataModel);
    }

    return this._instance;
  }
  public RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.GetDataFromSever.bind(this));
  }

  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.GetDataFromSever.bind(this));
  }

  GetDataFromSever(data) {
    console.log("data", data);
    let dataJson = JSON.parse(data);
    let dataID = dataJson.ID;
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
        break;
      case DT_commandID_OP.DT_RECORD_PLAYERS:
        this.sendToDirector_recordPlayersList(dataJson);
        break;
    }
  }
  SendToDirector_initTreasure(initTreasureData: DT_initTreaDataFull) {
    let initTreasureDataModel = this.i_buildDataModel.buildInitTreasure_dataMode(initTreasureData);
    console.log("initTreasureDataModel", initTreasureData);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, initTreasureDataModel);
  }

  sendToDirector_initPlayerInfo(playerInfo: DT_playerInfoDataFull) {
    let playerInfoDataModel = this.i_buildDataModel.buildInitPlayerInfo_dataModel(playerInfo);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, playerInfoDataModel);
  }

  sendToDirector_getListRandomLocationTreasure(listRandomLocationTreasure: DT_listRandomLocationTreasure_OP) {
    let randomListLocation = this.i_buildDataModel.buildListRandomLocationTreasure_dataModel(listRandomLocationTreasure);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, randomListLocation);
  }

  sendToDirector_resultOnclickPiece(dataJson: DT_sendResultOnclickingThePiece) {
    let resultOnclickPieceDataModel = this.i_buildDataModel.buildResultOnclickPiece_dataModel(dataJson);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, resultOnclickPieceDataModel);
  }

  sendToDirector_recordPlayersList(dataJson: DT_recordPlayersList) {
    console.log("record data", dataJson);
    let recordPlayersList_dataModel = this.i_buildDataModel.builPlayersInfo_DataModel(dataJson);
    console.log("record data", recordPlayersList_dataModel);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.RECORD_PLAYERS_DATA, recordPlayersList_dataModel);
  }
}
