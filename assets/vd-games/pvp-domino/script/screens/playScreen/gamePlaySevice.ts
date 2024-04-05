import { DT_listTreasureMap_LocalStorage } from "./../../common/Config";
import { IP_GET_RECORD_PLAYERS } from "./../../model/InputDataModel";
import { DT_PLAYER_INFO_MODEL, DT_listRandomLocationTreasure_dataModel } from "./../../model/OutputDataModel";
import { VDEventListener } from "../../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT, DT_commanID_IP, DT_commandID_OP } from "../../network/NetworkDefine";
import { I_director, I_gamePlaySevice, I_playScreen } from "./../../common/InterfaceDefine";
import { _decorator, Component } from "cc";
import { DT_sendResultOnclickingThePiece_dataModel } from "../../model/OutputDataModel";
import { DT_KEY_WORD, DT_MESENGER } from "../../common/Define";
import { IP_GET_LIST_TREASURE_MAP } from "./../../model/InputDataModel";
import { IP_GET_TREASURE_RANDOM_LIST } from "./../../model/InputDataModel";
import { IP_SET_LIST_MONEY_WIN_LOSE_NEW_ROUND } from "./../../model/InputDataModel";
import { PopupTreasure } from "../../popups/PopupTreasure";

const { ccclass, property } = _decorator;

@ccclass("gamePlaySevice")
export class gamePlaySevice implements I_gamePlaySevice {
  private static _instance: gamePlaySevice = null!;
  public static get instance(): gamePlaySevice {
    if (this._instance == null) {
      this._instance = new gamePlaySevice();
    }

    return this._instance;
  }
  private _i_director: I_director = null;
  private _i_gamePlayCtr: I_playScreen = null;
  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  playerInfor_localStorage: DT_PLAYER_INFO_MODEL = null;
  getRecordPlayersList: IP_GET_RECORD_PLAYERS = null;
  listTreasureMap_localStorage: DT_listTreasureMap_LocalStorage = null;
  getListTreasureMap: IP_GET_LIST_TREASURE_MAP = null;
  IP_getTreasureRandomList: IP_GET_TREASURE_RANDOM_LIST = null;
  IP_setListMoney_win_lose_game: IP_SET_LIST_MONEY_WIN_LOSE_NEW_ROUND = null;

  treasureOpen: number = 0;
  indexMapCurrent: number = 1;
  ValueRowAndColumn: number = 3;

  public setVarInterface(director: I_director, gamePlayerCtr: I_playScreen) {
    this._i_director = director;
    this._i_gamePlayCtr = gamePlayerCtr;
  }
  
  //handle data to director
  getDataFromDirector(data) {
    let dataID = data.id;
    switch (dataID) {
      case DT_commandID_OP.DT_USER_INFO:
        console.log(data);
        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.PLAYER_INFO, data);
        break;

      case DT_commandID_OP.DT_INIT_TREASURE_START_GAME:
        console.log(data);
        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.TREASURE_DATA, data);
        break;

      case DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE:
        this.updateMoneyAfterWithResult(data);
        break;
    }
  }

  getListRandomLocationTreasure(data: DT_listRandomLocationTreasure_dataModel, listNode: Node[], dm_popup1: PopupTreasure) {
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.LIST_RANDOM_LOCATION_TREASURE, data, listNode, dm_popup1);
  }

  updateMoneyAfterWithResult(data: DT_sendResultOnclickingThePiece_dataModel): void {
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_TREASURE, data);
    this.resultOnclickPiece = data;
    let clonePlayerInfo: DT_PLAYER_INFO_MODEL = null;
    if (this.resultOnclickPiece.money > 0 && !this.resultOnclickPiece.resultOnClick) {
      this.playerInfor_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      clonePlayerInfo = this.playerInfor_localStorage;
      let coinCurrent = clonePlayerInfo.money - this.resultOnclickPiece.money;
      this.SetDataPlayerInfoInLocalStorage(clonePlayerInfo, coinCurrent);
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UPDATE_COIN_WIN_LOSE_GAME, this.playerInfor_localStorage.money);
      if (this.playerInfor_localStorage.money < 0) {
        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_MESENGER, DT_MESENGER.NOT_MONEY);
      }
      this.sendDataToSever_getRecordPlayers();
    } else if (this.resultOnclickPiece.money > 0 && this.resultOnclickPiece.resultOnClick) {
      this.treasureOpen++;
      this.setDataListTreasureInMap_localStorage(this.treasureOpen, this.indexMapCurrent, this.ValueRowAndColumn);
      this.playerInfor_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      clonePlayerInfo = this.playerInfor_localStorage;
      let coinCurrent = clonePlayerInfo.money + this.resultOnclickPiece.money;
      this.SetDataPlayerInfoInLocalStorage(clonePlayerInfo, coinCurrent);
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UPDATE_COIN_WIN_LOSE_GAME, this.playerInfor_localStorage.money);
      this.sendDataToSever_GetTreasureInMap();
      this.sendDataToSever_getRecordPlayers();
    }
  }

  SetDataPlayerInfoInLocalStorage(clonePlayerInfo: DT_PLAYER_INFO_MODEL, coinCurrent: number) {
    if (this.playerInfor_localStorage) {
      this.playerInfor_localStorage = {
        id: clonePlayerInfo.id,
        userName: clonePlayerInfo.userName,
        avatarID: clonePlayerInfo.avatarID,
        money: coinCurrent,
      };
    }
    localStorage.setItem(DT_KEY_WORD.PLAYER_INFO, JSON.stringify(this.playerInfor_localStorage));
  }

  sendDataToSever_getRecordPlayers() {
    this.getRecordPlayersList = {
      id: DT_commanID_IP.GET_RECORD_PLAYERS,
    };
    this._i_director.sendDataToSever(this.getRecordPlayersList);
  }

  setDataListTreasureInMap_localStorage(indextreasureCurrentOpen: number, indexMapCurrent: number, valueRowAndColumn: number) {
    this.listTreasureMap_localStorage = {
      indexTreasureCurrentOpen: indextreasureCurrentOpen,
      indexMapCurrent: indexMapCurrent,
      valueRowAndColumn: valueRowAndColumn,
    };
    let dataStringIfly = JSON.stringify(this.listTreasureMap_localStorage);
    localStorage.setItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP, dataStringIfly);
  }

  sendDataToSever_GetTreasureInMap() {
    if (localStorage.getItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP) == null) {
      this.getListTreasureMap = {
        id: DT_commanID_IP.GET_LIST_TREASURE,
        treasureCurrent: this.treasureOpen,
        indexMapCurrent: this.indexMapCurrent,
        valueRowAndColumn: this.ValueRowAndColumn,
      };
      this._i_director.sendDataToSever(this.getListTreasureMap);
      this.setDataListTreasureInMap_localStorage(this.treasureOpen, this.indexMapCurrent, this.ValueRowAndColumn);
    } else {
      this.listTreasureMap_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP));
      if (this.listTreasureMap_localStorage) {
        console.log("list treasure in local", this.listTreasureMap_localStorage);
        this.treasureOpen = this.listTreasureMap_localStorage.indexTreasureCurrentOpen;
        this.indexMapCurrent = this.listTreasureMap_localStorage.indexMapCurrent;
        this.ValueRowAndColumn = this.listTreasureMap_localStorage.valueRowAndColumn;
        console.log("treasureOpen", this.treasureOpen);
        if (this.treasureOpen >= 8) {
          this.treasureOpen = 0;
          this.indexMapCurrent++;
          this.ValueRowAndColumn++;
          if (this.indexMapCurrent == 4) {
            this.indexMapCurrent = 1;
            this.ValueRowAndColumn = 3;
          }
          this.setDataListTreasureInMap_localStorage(this.treasureOpen, this.indexMapCurrent, this.ValueRowAndColumn);

          setTimeout(function () {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_MESENGER, DT_MESENGER.END_MAP);
          }, 7000);
        } else {
          this.getListTreasureMap = {
            id: DT_commanID_IP.GET_LIST_TREASURE,
            treasureCurrent: this.treasureOpen,
            indexMapCurrent: this.indexMapCurrent,
            valueRowAndColumn: this.ValueRowAndColumn,
          };
          this._i_director.sendDataToSever(this.getListTreasureMap);
        }
      }
    }
  }

  send_getTreasureRandomList(indexTreasure: number) {
    this.IP_getTreasureRandomList = {
      id: DT_commanID_IP.GET_TREASURE_RAMDOM_INDEX,
      TreasureIndex: indexTreasure,
    };
    this._i_director.sendDataToSever(this.IP_getTreasureRandomList);
  }

  sendDataToSever_setListMoneyWinLoseGame() {
    this.IP_setListMoney_win_lose_game = {
      id: DT_commanID_IP.SET_LIST_MONEY_WIN_LOSE_NEW_ROUND,
      mapCurrent: this.indexMapCurrent,
    };
    this._i_director.sendDataToSever(this.IP_setListMoney_win_lose_game);
  }

  setIndexMap() {
    console.log("set index map");
    this._i_director.setIndexMap(this.indexMapCurrent);
  }

  getPlayerInfoToHome() {
    this._i_director.getPlayerInfoInHomeScreen();
  }

  getDataTableView_recordPlayer() {
    this._i_director.initDataTableView_recordPlayers();
  }
}
