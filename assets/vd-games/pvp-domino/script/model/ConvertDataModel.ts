import { _decorator } from "cc";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_playerInfoDataFull, DT_recordPlayersList, DT_sendResultOnclickingThePiece } from "./OutputDataFull";
import { DT_INIT_TREASURE_MODEL, DT_listRandomLocationTreasure_dataModel, DT_PLAYER_INFO_MODEL, DT_recordPlayersList_dataModel, DT_sendResultOnclickingThePiece_dataModel } from "./OutputDataModel";
import { I_buildDataModel } from "../common/InterfaceDefine";
const { ccclass, property } = _decorator;

@ccclass("ConvertDataModel")
export class ConvertDataModel implements I_buildDataModel {
  private static _instance: ConvertDataModel = null!;

  public static get instance(): ConvertDataModel {
    if (this._instance == null) {
      this._instance = new ConvertDataModel();
    }

    return this._instance;
  }
  buildInitTreasure_dataMode(treasureData: DT_initTreaDataFull): DT_INIT_TREASURE_MODEL {
    const treasure_data: DT_INIT_TREASURE_MODEL = {
      id: treasureData.ID,
      listTreasureStatus: treasureData.L,
      treasureCurrentNotOpen: treasureData.TC,
      mapCurrent: treasureData.M,
    };
    return treasure_data;
  }

  buildInitPlayerInfo_dataModel(playerData: DT_playerInfoDataFull): DT_PLAYER_INFO_MODEL {
    const player_data: DT_PLAYER_INFO_MODEL = {
      id: playerData.ID,
      userName: playerData.N,
      avatarID: playerData.A_ID,
      money: playerData.M,
    };
    return player_data;
  }

  buildListRandomLocationTreasure_dataModel(listRandomLocation: DT_listRandomLocationTreasure_OP): DT_listRandomLocationTreasure_dataModel {
    const listRandom_Location: DT_listRandomLocationTreasure_dataModel = {
      id: listRandomLocation.ID,
      listRandomLocationTreasure: listRandomLocation.LT,
      indexMapCurrent: listRandomLocation.MR,
      valueRowAndColumn: listRandomLocation.RC,
    };
    return listRandom_Location;
  }

  buildResultOnclickPiece_dataModel(resultData: DT_sendResultOnclickingThePiece): DT_sendResultOnclickingThePiece_dataModel {
    const result_data: DT_sendResultOnclickingThePiece_dataModel = {
      id: resultData.ID,
      indexInArr: resultData.I,
      countOnClick: resultData.C,
      resultOnClick: resultData.R_OnClick,
      money: resultData.M,
    };
    return result_data;
  }

  builPlayersInfo_DataModel(data: DT_recordPlayersList): DT_recordPlayersList_dataModel {
    const dataModel: DT_recordPlayersList_dataModel = {
      id: data.ID,
      ListPlayesInfo: data.L,
    };
    return dataModel;
  }
}
