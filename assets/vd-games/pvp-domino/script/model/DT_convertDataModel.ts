import { _decorator, Component, Node } from "cc";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_playerInfoDataFull, DT_sendResultOnclickingThePiece } from "./DT_outputDataFull";
import { DT_INIT_TREASURE_MODEL, DT_listRandomLocationTreasure_dataModel, DT_PLAYER_INFO_MODEL, DT_sendResultOnclickingThePiece_dataModel } from "./DT_outputDataModel";
const { ccclass, property } = _decorator;

@ccclass("DT_convertDataModel")
export class DT_convertDataModel {
  static buildInitTreasure(treasureData: DT_initTreaDataFull): DT_INIT_TREASURE_MODEL {
    const treasure_data: DT_INIT_TREASURE_MODEL = {
      id: treasureData.ID,
      listTreasureStatus: treasureData.L,
    };
    return treasure_data;
  }
  static buildInitPlayerInfo(playerData: DT_playerInfoDataFull): DT_PLAYER_INFO_MODEL {
    const player_data: DT_PLAYER_INFO_MODEL = {
      id: playerData.ID,
      userName: playerData.N,
      avatarID: playerData.A_ID,
      money: playerData.M,
    };
    return player_data;
  }
  static buildListRandomLocationTreasure(listRandomLocation: DT_listRandomLocationTreasure_OP): DT_listRandomLocationTreasure_dataModel {
    const listRandom_Location: DT_listRandomLocationTreasure_dataModel = {
      id: listRandomLocation.ID,
      listRandomLocationTreasure: listRandomLocation.LT,
    };
    return listRandom_Location;
  }
  static buildResultOnclickPiece(resultData: DT_sendResultOnclickingThePiece): DT_sendResultOnclickingThePiece_dataModel {
    const result_data: DT_sendResultOnclickingThePiece_dataModel = {
      id: resultData.ID,
      indexInArr: resultData.I,
      countOnClick: resultData.C,
      resultOnClick: resultData.R_OnClick,
      money: resultData.M,
    };
    return result_data;
  }
}
