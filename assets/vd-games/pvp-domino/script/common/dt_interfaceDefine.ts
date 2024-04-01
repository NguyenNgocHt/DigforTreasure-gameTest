import { DT_INIT_TREASURE_MODEL, DT_PLAYER_INFO_MODEL, DT_listRandomLocationTreasure_dataModel, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";

export interface I_homeScreen {
  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void;
  CallinitPlayerInfo(): void;
}

export interface I_playScreen {
  InitTreasure(data: DT_INIT_TREASURE_MODEL): void;
  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void;
  updateMoneyAfterWithResult(data: DT_sendResultOnclickingThePiece_dataModel): void;
}

export interface I_popup1 {
  initTableTreasure(data, listIconNode): void;
  showResultOnClickToPiece(data: DT_sendResultOnclickingThePiece_dataModel): void;
  onClickButton_sound(): void;
}
export interface I_poolControler {
  PushIconPiece(iconNode): void;
}
