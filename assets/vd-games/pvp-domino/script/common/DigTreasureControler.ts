import { DT_convertDataModel } from "./../model/DT_convertDataModel";
import { DT_initTreaDataFull, DT_listRandomLocationTreasure_OP, DT_sendResultOnclickingThePiece } from "./../model/DT_outputDataFull";
import { DT_PLAYER_INFO_MODEL } from "./../model/DT_outputDataModel";
import { DT_commandID_OP } from "./../network/DT_networkDefine";
import { VDScrollBarDirection } from "./../../../../vd-framework/ui/VDScrollBar";
import { mock_treasureOpen } from "./../../../../vd-mock/mock_config";
import { StartScene } from "./../../../../vd-boot/StartScene";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { _decorator, Component, Node, director } from "cc";
import { DT_GAME_STATUS_EVENT, DT_commanID_IP } from "../network/DT_networkDefine";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_TREASURE_RANDOM_LIST, IP_SEND_INDEX_ONCLICK_PIECE, PALYER_NAME_DATA } from "../model/DT_inputDataModel";
import { DT_playerInfoDataFull } from "../model/DT_outputDataFull";
import { ValueType } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DigTreasureControler")
export class DigTreasureControler extends Component {
  MONEY_WIN_IN_TREASURE: number[] = [];
  MONEY_LOSE_IN_TREASURE: number[] = [];
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
  private listRandom: number[] = [];
  private countOnclickPiece: number = 0;
  private digTreasureCurrentIndex = 0;
  private treasureNumber: number = 8;
  private pieceNumber: number = 9;
  initListMoneyInTreasure() {
    let valueMoney_win_origin = 1000;
    let valueMoney_lose_origin = 100;
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
  }
  RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, this.getDataFromCLient.bind(this));
  }
  getDataFromCLient(data) {
    console.log("data", data);
    let commanID = data.id;
    let dataJson = data;
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
    }
  }
  setAvatarID(data) {
    if (localStorage.getItem("PLAYER-INFO") == null) {
      this.userNameData = {
        ID: DT_commandID_OP.DT_USER_INFO,
        N: data.playerName,
        A_ID: this.RandomNumber(1, 12),
        M: 1000,
      };
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.userNameData);
    } else {
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem("PLAYER-INFO"));
      this.userNameData = {
        ID: DT_commandID_OP.DT_USER_INFO,
        N: data.playerName,
        A_ID: this.playerInfor_localStogare.avatarID,
        M: this.playerInfor_localStogare.money,
      };
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.userNameData);
    }
    console.log("user name data", this.userNameData);
  }
  setRandomListDigLocation(data: IP_GET_TREASURE_RANDOM_LIST) {
    this.digTreasureCurrentIndex = data.TreasureIndex;
    this.listRandom = [];
    console.log("data", data);
    let randomLocationWithTreasure = this.RandomNumber(0, 8);
    let listRandom = this.InitListRandom(randomLocationWithTreasure);
    this.listRandom = listRandom;
    console.log("list random", listRandom);
    this.op_listRandomLocationTreasure = {
      ID: DT_commandID_OP.DT_LIST_RANDOM_LOCATION_TREASURE,
      LT: listRandom,
    };
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_listRandomLocationTreasure);
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
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_resultOnclickPiece);
          } else {
            this.op_resultOnclickPiece = {
              ID: DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE,
              I: data.indexInArr,
              C: this.countOnclickPiece,
              R_OnClick: false,
              M: this.MONEY_LOSE_IN_TREASURE[this.digTreasureCurrentIndex],
            };
            console.log("op_resultOnclickPiece", this.op_resultOnclickPiece);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_resultOnclickPiece);
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
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_resultOnclickPiece);
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
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_resultOnclickPiece);
          }
        }
      }
    }
    if (this.countOnclickPiece == 3) {
      this.countOnclickPiece = 0;
    }
  }
  InitListRandom(randomNumber: number): number[] {
    let listRandom: number[];
    listRandom = [];
    for (let i = 0; i < this.pieceNumber; i++) {
      if (i == randomNumber) {
        listRandom.push(1);
      } else {
        listRandom.push(0);
      }
    }
    return listRandom;
  }
  RandomNumber(minNumber: number, maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber) + minNumber;
  }
  public InitTreasure(dataJson: IP_GET_LIST_TREASURE_MAP) {
    let listTreasureOpen: number[];
    listTreasureOpen = [];
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
    };
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEVER_TO_CLIENT, this.op_listTreasureOpenInMap);
  }
}
