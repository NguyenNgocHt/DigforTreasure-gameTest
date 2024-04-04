import { showIUControler } from "./../controler/showIUControler";
import { initObjControler } from "./../controler/initObjControler";
import { DT_GAME_STATUS_EVENT } from "./../network/DT_networkDefine";
import { _decorator, Node } from "cc";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import { dm_Director } from "../common/dm_Director";
import { DT_INIT_TREASURE_MODEL, DT_listRandomLocationTreasure_dataModel, DT_PLAYER_INFO_MODEL, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_RECORD_PLAYERS } from "../model/DT_inputDataModel";

import { DT_listTreasureMap_LocalStorage } from "../common/dm_Config";
import { I_director, I_gamePlaySevice, I_initObjControler, I_menuControler, I_playScreen, I_playerView, I_popup1, I_popup1_svice, I_showUI } from "../common/dt_interfaceDefine";
import { playerView } from "./playScreen/playerView";
import { menuControler } from "./playScreen/menuControler";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { gamePlaySevice } from "./playScreen/gamePlaySevice";
import { dm_Popup1 } from "../popups/dm_Popup1";
import { popup1_sevice } from "../popups/popup1/popup1_sevice";

const { ccclass, property } = _decorator;

@ccclass("dm_PlayScreen3")
export class dm_PlayScreen3 extends VDBaseScreen implements I_playScreen {
  @property(Node)
  listPosMap1: Node = null;
  @property(Node)
  listPosMap2: Node = null;
  @property(Node)
  listPosMap3: Node = null;
  @property(showIUControler)
  showUIControler: showIUControler = null;
  @property(initObjControler)
  initControler: initObjControler = null;
  @property(playerView)
  PlayerView: playerView = null;
  @property(menuControler)
  MenuCtr: menuControler = null;
  @property(gamePlaySevice)
  gamePlaySevice: gamePlaySevice = null;

  playerInfor_localStorage: DT_PLAYER_INFO_MODEL = null;
  listTreasureMap_localStorage: DT_listTreasureMap_LocalStorage = null;
  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;
  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;

  getListTreasureMap: IP_GET_LIST_TREASURE_MAP = null;
  getRecordPlayersList: IP_GET_RECORD_PLAYERS = null;

  listPosTreasure: Node[] = [];

  treasureOpen: number = 0;
  indexMapCurrent: number = 1;
  ValueRowAndColumn: number = 3;

  private _i_director: I_director = null;
  private _i_initObjControler: I_initObjControler = null;
  private _i_menuCtr: I_menuControler = null;
  private _i_playerView: I_playerView = null;
  private _i_UICtr: I_showUI = null;
  private _iGamePlaySecive: I_gamePlaySevice = null;
  private _iPopup1: I_popup1 = null;
  private _iPopup1_sevice: I_popup1_svice = null;

  start() {
    this.registerEvent();
    this.scheduleOnce(function () {
      this.set_varInterface(dm_Director.instance, this.initControler, this.MenuCtr, this.PlayerView, this.showUIControler, this.gamePlaySevice);
      this.initControler.setVarInterface(this);
      this.MenuCtr.setVarInterface(this);
      this.showUIControler.setVarInterface(this);
      this.gamePlaySevice.setVarInterface(dm_Director.instance, this);
      this._iGamePlaySecive.sendDataToSever_GetTreasureInMap();
      this._iGamePlaySecive.sendDataToSever_getRecordPlayers();
    }, 0.2);
  }
  //registerEvent
  registerEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.PLAYER_INFO, this.initPlayerInfo.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.TREASURE_DATA, this.InitTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.UPDATE_COIN_WIN_LOSE_GAME, this.playerView_updateCoin.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SHOW_MESENGER, this.uiCtr_showMesenger.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.GET_THE_NEXT_TREASURE_ON_THE_MAP, this.getNextTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.GET_RECORD_PLAYERS, this.getRecordPlayer.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_TREASURE, this.getListRandomTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SET_LIST_MONEY_WIN_LOSE, this.setupNewBonusArray.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SET_INDEX_MAP, this.set_index_map.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_RECORD_PLAYERS, this.initRecordPlayers.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.LIST_RANDOM_LOCATION_TREASURE, this.sendDataToPopup_initLocationTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_TREASURE, this.setResultOnclickTreasure.bind(this));
  }
  OffEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.PLAYER_INFO, this.initPlayerInfo.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.TREASURE_DATA, this.InitTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.UPDATE_COIN_WIN_LOSE_GAME, this.playerView_updateCoin.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SHOW_MESENGER, this.uiCtr_showMesenger.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.GET_THE_NEXT_TREASURE_ON_THE_MAP, this.getNextTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.GET_RECORD_PLAYERS, this.getRecordPlayer.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_TREASURE, this.getListRandomTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SET_LIST_MONEY_WIN_LOSE, this.setupNewBonusArray.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SET_INDEX_MAP, this.set_index_map.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_RECORD_PLAYERS, this.initRecordPlayers.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_TREASURE, this.setResultOnclickTreasure.bind(this));
  }
  // init icon game
  InitTreasure(data: DT_INIT_TREASURE_MODEL): void {
    this._i_initObjControler.init_treasure(data);
  }

  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void {
    this._i_playerView.init_playerInfo(data);
  }

  playerView_updateCoin(coin) {
    this._i_playerView.showCoinWinLose(coin);
  }

  uiCtr_showMesenger(mesenger: string) {
    this._i_UICtr.showPopupMessage(mesenger);
  }

  getNextTreasure() {
    this._iGamePlaySecive.sendDataToSever_GetTreasureInMap();
  }

  getRecordPlayer() {
    this._iGamePlaySecive.sendDataToSever_getRecordPlayers();
  }

  getListRandomTreasure(indexTreasure: number) {
    this._iGamePlaySecive.send_getTreasureRandomList(indexTreasure);
  }

  setupNewBonusArray() {
    this._iGamePlaySecive.sendDataToSever_setListMoneyWinLoseGame();
  }

  set_index_map() {
    this._iGamePlaySecive.setIndexMap();
  }
  initRecordPlayers() {
    this._iGamePlaySecive.getDataTableView_recordPlayer();
  }

  callMenuGroup_onClickBtnBackToScreen1() {
    this._i_menuCtr.onClickBtnBackToScreen1();
  }

  sendDataToPopup_initLocationTreasure(data: DT_listRandomLocationTreasure_dataModel, listNode: Node[], dm_popup1: dm_Popup1) {
    this._iPopup1_sevice = dm_popup1.node.getComponent(popup1_sevice);
    this._iPopup1 = dm_popup1;
    this._iPopup1.setup_newPopup();
    this._iPopup1_sevice.getDataFromGamePlayScreen_initLocationTreasure(data, listNode);
  }

  setResultOnclickTreasure(data) {
    this._iPopup1_sevice.getDataFromGamePlayScreen(data);
  }
  set_varInterface(director: I_director, initObjControler: I_initObjControler, menuCtr: I_menuControler, playerView: I_playerView, UICtr: I_showUI, gamePlaySevice: I_gamePlaySevice) {
    this._i_director = director;
    this._i_initObjControler = initObjControler;
    this._i_menuCtr = menuCtr;
    this._i_playerView = playerView;
    this._i_UICtr = UICtr;
    this._iGamePlaySecive = gamePlaySevice;
  }
}
