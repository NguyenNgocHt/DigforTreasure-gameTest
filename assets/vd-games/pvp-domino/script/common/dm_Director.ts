import { gamePlaySevice } from "./../screens/playScreen/gamePlaySevice";
import { I_director, I_gamePlaySevice, I_homeScreen, I_playScreen, I_poolControler, I_popup1 } from "./dt_interfaceDefine";
import { poolControler } from "./../controler/pool/poolControler";
import { dm_Popup1 } from "./../popups/dm_Popup1";
import { dm_PlayScreen3 } from "./../screens/dm_PlayScreen3";
import { _decorator, Node } from "cc";
import { dm_PlayScreen } from "../screens/dm_PlayScreen";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../network/DT_networkDefine";
import {
  DT_INIT_TREASURE_MODEL,
  DT_listRandomLocationTreasure_dataModel,
  DT_PLAYER_INFO_MODEL,
  DT_recordPlayersList_dataModel,
  DT_sendResultOnclickingThePiece_dataModel,
} from "../model/DT_outputDataModel";
import { PLAYER_NAME_DATA } from "../model/DT_inputDataModel";
import { dm_PopupNotify } from "../popups/dm_PopupNotify";
import { dm_TableView } from "../popups/table_view/dm_TableView";
import { VDTableViewDataSource } from "../../../../vd-framework/ui/VDTableView";
const { ccclass, property } = _decorator;

@ccclass("dm_Director")
export class dm_Director implements I_director {
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
  tableView: dm_TableView | null = null;

  private _iHomeScreen: I_homeScreen = null;
  private _iPlayScreen: I_playScreen = null;
  private _iPopup1: I_popup1 = null;
  private _iPoolControler: I_poolControler = null;
  private _iTableView: VDTableViewDataSource = null;
  private _iGamePlaySevice: I_gamePlaySevice = null;

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

  private recordPlayesList: DT_recordPlayersList_dataModel = null;
  public get RecordPlayesList(): DT_recordPlayersList_dataModel {
    return this.recordPlayesList;
  }
  //input to sever
  private playerNameDataModel: PLAYER_NAME_DATA = null;
  private indexMapCurrent = 1;

  start() {
    // this.RegisterEvent();
  }
  public RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, this.setPlayerInfo.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, this.initLocationTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, this.setResultOnclickToPiece.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.RECORD_PLAYERS_DATA, this.getRecordPlayers.bind(this));
  }

  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_PLAYER_INFO, this.setPlayerInfo.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_LOCATION_TREASURE, this.initLocationTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.RESULT_ONCLICK_PIECE, this.setResultOnclickToPiece.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.RECORD_PLAYERS_DATA, this.getRecordPlayers.bind(this));
  }
  //************************get data from sever and push data to screen*******************************************
  GetInitTreasureDataModel(initTreasureDataModel: DT_INIT_TREASURE_MODEL) {
    this.initTreasure_dataModel = initTreasureDataModel;
    console.log("initTreasure_dataModel", this.initTreasure_dataModel);
    this.initTreasure();
    this.initPlayerInfo();
  }

  setPlayerInfo(playerInfo: DT_PLAYER_INFO_MODEL) {
    this.initPlayerInfo_dataModel = playerInfo;
    if (this.homeScreen) {
      this.set_iHomeScreen(this.homeScreen);
      console.log(this.initPlayerInfo_dataModel);
      this._iHomeScreen.initPlayerInfo(this.initPlayerInfo_dataModel);
    }
  }

  initLocationTreasure(listRandomLocation: DT_listRandomLocationTreasure_dataModel) {
    let listIconNode: Node[];
    listIconNode = [];
    this.listLocationTreasure = listRandomLocation;
    console.log("listLocationTreasure", this.listLocationTreasure);
    setTimeout(() => {
      if (this.pool_controler) {
        for (let i = 0; i < listRandomLocation.valueRowAndColumn * listRandomLocation.valueRowAndColumn; i++) {
          let iconNode = this.pool_controler.GetIconNodePiece();
          if (iconNode) {
            iconNode.active = true;
            listIconNode.push(iconNode);
          }
        }
      }
      if (this.dm_popup_1) {
        this.set_iPopup1(this.dm_popup_1);
        this._iGamePlaySevice.getListRandomLocationTreasure(this.listLocationTreasure, listIconNode, this.dm_popup_1);
      }
    }, 10);
  }

  setResultOnclickToPiece(data: DT_sendResultOnclickingThePiece_dataModel) {
    if (this.playScreen) {
      this.set_iPlayScreen(this.playScreen);
      this._iGamePlaySevice.getDataFromDirector(data);
    }
  }

  getRecordPlayers(data: DT_recordPlayersList_dataModel) {
    console.log("data da ve day director");
    this.recordPlayesList = data;
    console.log(this.recordPlayesList.ListPlayesInfo);
  }

  initDataTableView_recordPlayers() {
    if (this.tableView) {
      this.set_iTableView(this.tableView);
      this._iTableView.initListData(this.recordPlayesList.ListPlayesInfo);
    }
  }

  initTreasure() {
    console.log("initTreasure_dataModel", this.initTreasure_dataModel, this.playScreen);
    if (this.playScreen) {
      this.set_iGamePlaySevice(this.playScreen);
      this.set_iPlayScreen(this.playScreen);
      this._iGamePlaySevice.getDataFromDirector(this.initTreasure_dataModel);
    }
  }
  initPlayerInfo() {
    this.initPlayerInfo_dataModel = JSON.parse(localStorage.getItem("PLAYER-INFO"));
    this._iGamePlaySevice.getDataFromDirector(this.initPlayerInfo_dataModel);
  }

  GetInitTreasureData(): DT_INIT_TREASURE_MODEL {
    if (this.initTreasure_dataModel) {
      return this.initTreasure_dataModel;
    }
  }

  pushPoolPiece(poolNode: Node) {
    if (this.pool_controler) {
      this.set_iPoolControl(this.pool_controler);
      this._iPoolControler.PushIconPiece(poolNode);
    }
  }

  getPlayerInfoInHomeScreen() {
    if (this.homeScreen) {
      this.set_iHomeScreen(this.homeScreen);
      this._iHomeScreen.CallinitPlayerInfo();
    }
  }

  setIndexMap(indexMap: number) {
    this.indexMapCurrent = indexMap;
  }

  onClickButton_sound() {
    if (this.dm_popup_1) {
      this.set_iPopup1(this.dm_popup_1);
      this._iPopup1.onClickButton_sound();
    }
  }

  //send data to sever
  public sendDataToSever(data) {
    console.log("send data to server", data);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.DIRECTOR_TO_SEND_DATA_SEVER, data);
  }

  //set var interface
  set_iHomeScreen(i_homeScreen: I_homeScreen) {
    this._iHomeScreen = i_homeScreen;
  }

  set_iPlayScreen(i_playScreen: I_playScreen) {
    this._iPlayScreen = i_playScreen;
  }

  set_iPopup1(i_popup1: I_popup1) {
    this._iPopup1 = i_popup1;
  }

  set_iPoolControl(i_poolControl: I_poolControler) {
    this._iPoolControler = i_poolControl;
  }

  set_iTableView(i_tableView: VDTableViewDataSource) {
    this._iTableView = i_tableView;
  }
  set_iGamePlaySevice(playScreen: dm_PlayScreen3) {
    console.log("playScreen", playScreen.node);
    let gamePlay_Sevice = playScreen.node.getComponent(gamePlaySevice);
    console.log("gamePlaySevice", gamePlay_Sevice);
    this._iGamePlaySevice = gamePlay_Sevice;
  }
}
