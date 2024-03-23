import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_recordPlayersList, DT_sendResultOnclickingThePiece } from "./../model/DT_outputDataFull";
import { DT_PLAYER_INFO_MODEL } from "./../model/DT_outputDataModel";
import { DT_commandID_OP } from "./../network/DT_networkDefine";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { _decorator, Component } from "cc";
import { DT_GAME_STATUS_EVENT, DT_commanID_IP } from "../network/DT_networkDefine";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_TREASURE_RANDOM_LIST, IP_SEND_INDEX_ONCLICK_PIECE, PALYER_NAME_DATA } from "../model/DT_inputDataModel";
import { DT_playerInfoDataFull } from "../model/DT_outputDataFull";
import { DT_Global } from "./DT_Global";
import { DT_KEY_WORD, DT_path } from "./DT_define";
import { DT_playersInfo } from "./dm_Config";
import { JsonAsset } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DigTreasureControler")
export class DigTreasureControler extends Component {
  MONEY_WIN_IN_TREASURE: number[] = [];
  MONEY_LOSE_IN_TREASURE: number[] = [];
  LIST_INDEX_MAP: number[] = [];
  private static _instance: DigTreasureControler = null!;
  public static get instance(): DigTreasureControler {
    if (this._instance == null) {
      this._instance = new DigTreasureControler();
    }

    return this._instance;
  }
  private userNameData: DT_playerInfoDataFull = null;
  private playerInfor_localStogare: DT_PLAYER_INFO_MODEL = null;
  private op_listRandomLocationTreasure: DT_listRandomLocationTreasure_OP = null;
  private op_resultOnclickPiece: DT_sendResultOnclickingThePiece = null;
  private op_listTreasureOpenInMap: DT_initTreaDataFull = null;
  private op_recordPlayersList: DT_recordPlayersList = null;
  private ListGamePlayers_localStorage: DT_playersInfo[] = [];
  private ListGamePlayers: DT_playersInfo[] = [];
  private listRandom: number[] = [];
  private countOnclickPiece: number = 0;
  private digTreasureCurrentIndex = 0;
  private treasureNumber: number = 8;
  private pieceNumber: number = 9;
  private numberUsers: number = 50;
  private numberMap: number = 3;
  private indexMapCurrent = 0;
  private valueRowAndColumn: number = 3;
  initListMoneyInTreasure() {
    let valueMoney_win_origin = 1000;
    let valueMoney_lose_origin = 600;
    for (let i = 0; i < 8; i++) {
      valueMoney_win_origin = valueMoney_win_origin * (i + 1);
      this.MONEY_WIN_IN_TREASURE.push(valueMoney_win_origin);
    }
    console.log("value money win list", this.MONEY_WIN_IN_TREASURE);
    for (let i = 0; i < 8; i++) {
      valueMoney_lose_origin = valueMoney_lose_origin * (i + 1);
      this.MONEY_LOSE_IN_TREASURE.push(valueMoney_lose_origin);
    }
    console.log("value money lose list", this.MONEY_LOSE_IN_TREASURE);
    for (let i = 0; i < this.numberMap; i++) {
      let indexMap = i + 1;
      this.LIST_INDEX_MAP.push(indexMap);
    }
    console.log("list index map", this.LIST_INDEX_MAP);
  }
  initPlayerOtherInfo() {
    if (localStorage.getItem(DT_KEY_WORD.LIST_GAME_PLAYERS_INFO) == null) {
      for (let i = 0; i < this.numberUsers; i++) {
        let playerCoin = DT_Global.instance.RandomNumber(500000, 500000000);
        let avatarID = DT_Global.instance.RandomNumber(1, 25);
        let playerInfo: DT_playersInfo = null;
        let firstNamesUses = DT_Global.instance.getFirstName();
        playerInfo = {
          userName: firstNamesUses[i],
          avatarID: avatarID,
          coin: playerCoin,
        };
        this.ListGamePlayers_localStorage.push(playerInfo);
      }
      localStorage.setItem(DT_KEY_WORD.LIST_GAME_PLAYERS_INFO, JSON.stringify(this.ListGamePlayers_localStorage));
    } else {
      this.ListGamePlayers = JSON.parse(localStorage.getItem(DT_KEY_WORD.LIST_GAME_PLAYERS_INFO));
      console.log(this.ListGamePlayers);
    }
  }
  RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, this.getDataFromCLient.bind(this));
  }
  getDataFromCLient(data) {
    console.log("data", data);
    let dataJson = JSON.parse(data);
    let commanID = dataJson.id;
    switch (commanID) {
      case DT_commanID_IP.GET_LIST_TREASURE:
        this.InitTreasure(dataJson);
        break;
      case DT_commanID_IP.PLAYER_NAME_ID:
        this.setAvatarID(dataJson);
        break;
      case DT_commanID_IP.GET_TREASURE_RAMDOM_INDEX:
        this.setRandomListDigLocation(dataJson);
        break;
      case DT_commanID_IP.SEND_INDEX_ONCLICK_PIECE:
        this.setResultAction(dataJson);
        break;
      case DT_commanID_IP.GET_RECORD_PLAYERS:
        this.setRecordPlayersList();
        break;
    }
  }
  setRecordPlayersList() {
    if (this.ListGamePlayers) {
      let playerMainInfo: DT_playersInfo = null;
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      console.log(this.ListGamePlayers);
      for (let i = 0; i < this.ListGamePlayers.length; i++) {
        if (this.ListGamePlayers[i].userName === "ngockylan2") {
          this.ListGamePlayers.splice(i, 1);
        }
      }
      playerMainInfo = {
        userName: this.playerInfor_localStogare.userName,
        avatarID: this.playerInfor_localStogare.avatarID,
        coin: this.playerInfor_localStogare.money,
      };
      this.ListGamePlayers.push(playerMainInfo);
    }
    console.log(this.ListGamePlayers);
    this.sortedIndescendingOrder();
  }
  sortedIndescendingOrder() {
    for (let i = 0; i < this.ListGamePlayers.length - 1; i++) {
      for (let j = i + 1; j < this.ListGamePlayers.length; j++) {
        if (this.ListGamePlayers[i].coin < this.ListGamePlayers[j].coin) {
          let playerClone = this.ListGamePlayers[i];
          this.ListGamePlayers[i] = this.ListGamePlayers[j];
          this.ListGamePlayers[j] = playerClone;
        }
      }
    }
    console.log(this.ListGamePlayers);
    this.op_recordPlayersList = {
      ID: DT_commandID_OP.DT_RECORD_PLAYERS,
      L: this.ListGamePlayers,
    };
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_recordPlayersList));
  }
  setAvatarID(data) {
    if (localStorage.getItem(DT_KEY_WORD.PLAYER_INFO) == null) {
      this.userNameData = {
        ID: DT_commandID_OP.DT_USER_INFO,
        N: data.playerName,
        A_ID: DT_Global.instance.RandomNumber(1, 25),
        M: 1000,
      };
      let dataStringIfly = JSON.stringify(this.userNameData);
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, dataStringIfly);
    } else {
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      this.userNameData = {
        ID: DT_commandID_OP.DT_USER_INFO,
        N: data.playerName,
        A_ID: this.playerInfor_localStogare.avatarID,
        M: this.playerInfor_localStogare.money,
      };

      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.userNameData));
    }
    console.log("user name data", this.userNameData);
  }
  setRandomListDigLocation(data: IP_GET_TREASURE_RANDOM_LIST) {
    this.digTreasureCurrentIndex = data.TreasureIndex - 1;
    console.log("digtreasue current index", this.digTreasureCurrentIndex);
    this.listRandom = [];
    console.log("data", data);
    let randomLocationWithTreasure = DT_Global.instance.RandomNumber(0, this.valueRowAndColumn * this.valueRowAndColumn - 1);
    let listRandom = DT_Global.instance.InitListRandom(randomLocationWithTreasure, this.valueRowAndColumn * this.valueRowAndColumn);
    this.listRandom = listRandom;
    console.log("list random", listRandom);
    this.op_listRandomLocationTreasure = {
      ID: DT_commandID_OP.DT_LIST_RANDOM_LOCATION_TREASURE,
      LT: listRandom,
      MR: this.indexMapCurrent,
      RC: this.valueRowAndColumn,
    };
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_listRandomLocationTreasure));
  }
  setResultAction(data: IP_SEND_INDEX_ONCLICK_PIECE) {
    this.countOnclickPiece++;
    console.log("count onClick piece", this.countOnclickPiece);
    for (let i = 0; i < this.listRandom.length; i++) {
      console.log("count onClick piece", this.countOnclickPiece);
      if (this.countOnclickPiece === 3) {
        if (data.indexInArr == i) {
          if (this.listRandom[i] == 1) {
            console.log("tim duoc kho bau va next round");
            this.op_resultOnclickPiece = {
              ID: DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE,
              I: data.indexInArr,
              C: this.countOnclickPiece,
              R_OnClick: true,
              M: this.MONEY_WIN_IN_TREASURE[this.digTreasureCurrentIndex],
            };
            console.log("op_resultOnclickPiece", this.op_resultOnclickPiece);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_resultOnclickPiece));
          } else {
            this.op_resultOnclickPiece = {
              ID: DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE,
              I: data.indexInArr,
              C: this.countOnclickPiece,
              R_OnClick: false,
              M: this.MONEY_LOSE_IN_TREASURE[this.digTreasureCurrentIndex],
            };
            console.log("op_resultOnclickPiece", this.op_resultOnclickPiece);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_resultOnclickPiece));
            console.log("chuc mung ban tim duoc qua boom va next round");
          }
        }
      } else if (this.countOnclickPiece !== 3) {
        if (data.indexInArr == i) {
          if (this.listRandom[i] == 1) {
            console.log("tim duoc kho bau next luon");
            this.op_resultOnclickPiece = {
              ID: DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE,
              I: data.indexInArr,
              C: this.countOnclickPiece,
              R_OnClick: true,
              M: this.MONEY_WIN_IN_TREASURE[this.digTreasureCurrentIndex],
            };
            console.log("op_resultOnclickPiece", this.op_resultOnclickPiece);
            this.countOnclickPiece = 0;
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_resultOnclickPiece));
          } else {
            console.log("chuc mung ban tim duoc qua boom");
            this.op_resultOnclickPiece = {
              ID: DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE,
              I: data.indexInArr,
              C: this.countOnclickPiece,
              R_OnClick: false,
              M: 0,
            };
            console.log("op_resultOnclickPiece", this.op_resultOnclickPiece);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_resultOnclickPiece));
          }
        }
      }
    }
    if (this.countOnclickPiece == 3) {
      this.countOnclickPiece = 0;
    }
  }
  public InitTreasure(dataJson: IP_GET_LIST_TREASURE_MAP) {
    console.log("data init treasure", dataJson);
    let listTreasureOpen: number[];
    listTreasureOpen = [];
    this.indexMapCurrent = dataJson.indexMapCurrent;
    this.valueRowAndColumn = dataJson.valueRowAndColumn;
    let treasureCurrent = dataJson.treasureCurrent;
    for (let i = 0; i < this.treasureNumber; i++) {
      if (i <= treasureCurrent) {
        listTreasureOpen.push(1);
      } else {
        listTreasureOpen.push(0);
      }
    }
    this.op_listTreasureOpenInMap = {
      ID: DT_commandID_OP.DT_INIT_TREASURE_START_GAME,
      L: listTreasureOpen,
      TC: treasureCurrent,
      M: dataJson.indexMapCurrent,
    };
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, JSON.stringify(this.op_listTreasureOpenInMap));
  }
}
