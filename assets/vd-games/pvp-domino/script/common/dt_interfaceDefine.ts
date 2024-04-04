import { Node } from "cc";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_playerInfoDataFull, DT_recordPlayersList, DT_sendResultOnclickingThePiece } from "../model/DT_outputDataFull";
import {
  DT_INIT_TREASURE_MODEL,
  DT_PLAYER_INFO_MODEL,
  DT_listRandomLocationTreasure_dataModel,
  DT_recordPlayersList_dataModel,
  DT_sendResultOnclickingThePiece_dataModel,
} from "../model/DT_outputDataModel";
import { dm_PlayScreen3 } from "../screens/dm_PlayScreen3";

export interface I_homeScreen {
  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void;
  CallinitPlayerInfo(): void;
}

export interface I_playScreen {
  InitTreasure(data: DT_INIT_TREASURE_MODEL): void;
  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void;
  callMenuGroup_onClickBtnBackToScreen1(): void;
}

export interface I_popup1 {
  onClickButton_sound(): void;
  registerEvent(): void;
  setup_newPopup(): void;
}
export interface I_poolControler {
  PushIconPiece(iconNode): void;
}
export interface I_buildDataModel {
  buildInitTreasure_dataMode(data: DT_initTreaDataFull): DT_INIT_TREASURE_MODEL;
  buildInitPlayerInfo_dataModel(data: DT_playerInfoDataFull): DT_PLAYER_INFO_MODEL;
  buildListRandomLocationTreasure_dataModel(data: DT_listRandomLocationTreasure_OP): DT_listRandomLocationTreasure_dataModel;
  buildResultOnclickPiece_dataModel(data: DT_sendResultOnclickingThePiece): DT_sendResultOnclickingThePiece_dataModel;
  builPlayersInfo_DataModel(data: DT_recordPlayersList): DT_recordPlayersList_dataModel;
}
export interface I_director {
  sendDataToSever(data): void;
  setIndexMap(indexMap: number): void;
  getPlayerInfoInHomeScreen(): void;
  pushPoolPiece(Node): void;
  initDataTableView_recordPlayers(): void;
}
export interface I_initObjControler {
  init_treasure(data: DT_INIT_TREASURE_MODEL): void;
  setVarInterface(playGameControler: dm_PlayScreen3): void;
}
export interface I_menuControler {
  onClickBtnBackToScreen1(): void;
}
export interface I_playerView {
  init_playerInfo(data: DT_PLAYER_INFO_MODEL): void;
  showCoinWinLose(coin: number): void;
}
export interface I_showUI {
  showPopupMessage(message: string): void;
}
export interface I_gamePlaySevice {
  getDataFromDirector(data): void;
  sendDataToSever_GetTreasureInMap(): void;
  sendDataToSever_getRecordPlayers(): void;
  send_getTreasureRandomList(indexTreasure: number): void;
  sendDataToSever_setListMoneyWinLoseGame(): void;
  setIndexMap(): void;
  getDataTableView_recordPlayer(): void;
  getPlayerInfoToHome(): void;
  getListRandomLocationTreasure(data, listNode, dm_popup1): void;
}
export interface I_popup1_svice {
  getDataFromGamePlayScreen(data): void;
  getDataFromGamePlayScreen_initLocationTreasure(data, listNode): void;
}
export interface I_popup1_view {
  initTableTreasure(data, listNode): void;
  showPoint_loseGame(point: number): void;
  setMapPopup(indexMap): void;
}
