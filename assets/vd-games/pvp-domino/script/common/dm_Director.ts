import { poolControler } from "./../controler/pool/poolControler";
import { dm_Popup1 } from "./../popups/dm_Popup1";
import { dm_PlayScreen3 } from "./../screens/dm_PlayScreen3";
import { _decorator, Component, Node } from "cc";
import { dm_PlayScreen } from "../screens/dm_PlayScreen";
import { DigTreasureControler } from "./DigTreasureControler";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_commanID_IP, DT_GAME_STATUS_EVENT } from "../network/DT_networkDefine";
import { DT_INIT_TREASURE_MODEL, DT_listRandomLocationTreasure_dataModel, DT_PLAYER_INFO_MODEL, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { DT_initTreaDataFull } from "../model/DT_outputDataFull";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_TREASURE_RANDOM_LIST, IP_SEND_INDEX_ONCLICK_PIECE, PALYER_NAME_DATA } from "../model/DT_inputDataModel";
import { createDefaultPipeline } from "cc";
import { dm_PopupNotify } from "../popups/dm_PopupNotify";
const { ccclass, property } = _decorator;

@ccclass("dm_Director")
export class dm_Director extends Component {
  private static _instance: dm_Director = null!;

  public static get instance(): dm_Director {
    if (this._instance == null) {
      this._instance = new dm_Director();
    }

    return this._instance;
  }
  playScreen: dm_PlayScreen3 | null = null;
  homeScreen: dm_PlayScreen | null = null;
  dm_popup_1: dm_Popup1 | null = null;
  pool_controler: poolControler | null = null;
  notifyPopup: dm_PopupNotify | null = null;
  //output from sever
  private initTreasure_dataModel: DT_INIT_TREASURE_MODEL = null;
  public get InitTreasure_dataModel(): DT_INIT_TREASURE_MODEL {
    return this.initTreasure_dataModel;
  }

  private initPlayerInfo_dataModel: DT_PLAYER_INFO_MODEL = null;
  public get InitPlayerInfo_dataModel(): DT_PLAYER_INFO_MODEL {
    return this.initPlayerInfo_dataModel;
  }

  private listLocationTreasure: DT_listRandomLocationTreasure_dataModel = null;
  public get ListLocationTreasure(): DT_listRandomLocationTreasure_dataModel {
    return this.listLocationTreasure;
  }

  private resultOnClickToPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  public get ResultOnClickToPiece(): DT_sendResultOnclickingThePiece_dataModel {
    return this.resultOnClickToPiece;
  }
  //input to sever
  private playerNameDataModel: PALYER_NAME_DATA = null;
  start() {
    // this.RegisterEvent();
  }
  public RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, this.setPlayerInfo.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, this.initLocationTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, this.setResultOnclickToPiece.bind(this));
  }

  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, this.setPlayerInfo.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, this.initLocationTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, this.setResultOnclickToPiece.bind(this));
  }
  //get data from sever
  GetInitTreasureDataModel(initTreasureDataModel: DT_INIT_TREASURE_MODEL) {
    this.initTreasure_dataModel = initTreasureDataModel;
    console.log("initTreasure_dataModel", this.initTreasure_dataModel);
    this.InitTreasure();
  }
  setPlayerInfo(playerInfo: DT_PLAYER_INFO_MODEL) {
    this.initPlayerInfo_dataModel = playerInfo;
    if (this.homeScreen) {
      console.log(this.initPlayerInfo_dataModel);
      this.homeScreen.initPlayerInfo(this.initPlayerInfo_dataModel);
    }
  }
  initLocationTreasure(listRandomLocation: DT_listRandomLocationTreasure_dataModel) {
    let listIconNode: Node[];
    listIconNode = [];
    this.listLocationTreasure = listRandomLocation;
    console.log("listLocationTreasure", this.listLocationTreasure);
    this.scheduleOnce(function () {
      if (this.pool_controler) {
        this.pool_controler.showConectFromDirector();
        for (let i = 0; i < 9; i++) {
          let iconNode = this.pool_controler.GetIconNodePiece();
          if (iconNode) {
            iconNode.active = true;
            listIconNode.push(iconNode);
          }
        }
        console.log("listNode", listIconNode);
      }
      if (this.dm_popup_1) {
        this.dm_popup_1.showLogConect();
        this.dm_popup_1.initTableTreasure(this.listLocationTreasure, listIconNode);
      }
    }, 0.2);
  }

  setResultOnclickToPiece(data: DT_sendResultOnclickingThePiece_dataModel) {
    this.resultOnClickToPiece = data;
    if (this.dm_popup_1) {
      this.dm_popup_1.showResultOnClickToPiece(this.resultOnClickToPiece);
    }
    if (this.playScreen) {
      this.playScreen.updateMoneyAfterWithResult(data);
    }
  }
  public InitTreasure() {
    console.log("initTreasure_dataModel", this.initTreasure_dataModel, this.playScreen);
    if (this.playScreen) {
      this.playScreen.InitTreasure(this.initTreasure_dataModel);
      this.initPlayerInfo_dataModel = JSON.parse(localStorage.getItem("PLAYER-INFO"));
      this.playScreen.initPlayerInfo(this.initPlayerInfo_dataModel);
    }
  }
  public GetInitTreasureData(): DT_INIT_TREASURE_MODEL {
    if (this.initTreasure_dataModel) {
      return this.initTreasure_dataModel;
    }
  }
  public pushPoolPiece(poolNode: Node) {
    if (this.pool_controler) {
      this.pool_controler.PushIconPiece(poolNode);
    }
  }
  //send data to sever
  public sendPlayerNameData(playerName: string) {
    this.playerNameDataModel = {
      id: DT_commanID_IP.PLAYER_NAME_ID,
      playerName: playerName,
    };
    console.log("this.playerNameDataModel", this.playerNameDataModel);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, this.playerNameDataModel);
  }
  public sendGetListRandomTreasure(data: IP_GET_TREASURE_RANDOM_LIST) {
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, data);
  }
  public send_indexOnclickPiece(data: IP_SEND_INDEX_ONCLICK_PIECE) {
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, data);
  }
  public send_getListTreasureInMap(data: IP_GET_LIST_TREASURE_MAP) {
    console.log("send get map");
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.CLIENT_TO_SEVER, data);
  }
}
