import { DT_Global } from "./../common/DT_Global";
import { DT_commanID_IP } from "./../network/DT_networkDefine";
import { Label, log, SpriteAtlas } from "cc";
import { _decorator, Node } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { dm_Popup1 } from "../popups/dm_Popup1";
import { dm_Director } from "../common/dm_Director";
import { DT_INIT_TREASURE_MODEL, DT_PLAYER_INFO_MODEL, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { Button } from "cc";
import { Sprite } from "cc";
import { color } from "cc";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_RECORD_PLAYERS, IP_GET_TREASURE_RANDOM_LIST } from "../model/DT_inputDataModel";
import { DT_KEY_WORD, DT_MESENGER, DT_path } from "../common/DT_define";
import { dm_PopupNotify } from "../popups/dm_PopupNotify";
import { DT_listTreasureMap_LocalStorage } from "../common/dm_Config";
import { JsonAsset } from "cc";
import { SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("dm_PlayScreen3")
export class dm_PlayScreen3 extends VDBaseScreen {
  @property(Label)
  lbNotify: Label = null!;
  @property(Node)
  TreasureGroup: Node = null;
  @property(Sprite)
  avatarUser: Sprite = null;
  @property(Label)
  userName: Label = null;
  @property(Label)
  coin: Label = null;
  @property(Node)
  treasureGroup: Node = null;
  @property(Node)
  listPosMap1: Node = null;
  @property(Node)
  listPosMap2: Node = null;
  @property(Node)
  listPosMap3: Node = null;
  @property(Node)
  BG_group: Node = null;
  private treasureData: DT_INIT_TREASURE_MODEL = null;
  private IP_getTreasureRandomList: IP_GET_TREASURE_RANDOM_LIST = null;
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
  private grayColor = color(128, 128, 128);
  private whiteColor = color(255, 255, 255);

  start() {
    this.scheduleOnce(function () {
      this.sendDataToSever_GetTreasureInMap();
      this.sendDataToSever_getRecordPlayers();
    }, 0.2);
  }

  onClickBtnBackToScreen1() {
    log(`onClickBtnBackToScreen1 1`);
    VDScreenManager.instance.popToRootScreen();
    dm_Director.instance.getPlayerInfoInHomeScreen();
  }

  onClickBtnShowPopup(event: TouchEvent, indexTreasure: number) {
    VDScreenManager.instance.showPopupFromPrefabName(
      DT_path.POPUP_1,
      (popup: VDBasePopup) => {
        let popupWin = popup as dm_Popup1;
        popupWin.finishedCallback = () => {
          log(" Just Closed Popup !!!");
          this.lbNotify.string = "";
          this.lbNotify && (this.lbNotify.node.active = true);
        };
      },
      true,
      true,
      true
    );
    this.IP_getTreasureRandomList = {
      id: DT_commanID_IP.GET_TREASURE_RAMDOM_INDEX,
      TreasureIndex: indexTreasure,
    };
    dm_Director.instance.sendDataToSever(this.IP_getTreasureRandomList);
  }

  onClickBtnShowTableView() {
    VDScreenManager.instance.showPopupFromPrefabName(DT_path.POPUP_TABLE_VIEW, (popup: VDBasePopup) => {}, true, true, true);
    this.scheduleOnce(function () {
      dm_Director.instance.initDataTableView_recordPlayers();
    }, 0.1);
  }

  sendDataToSever_GetTreasureInMap() {
    if (localStorage.getItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP) == null) {
      this.getListTreasureMap = {
        id: DT_commanID_IP.GET_LIST_TREASURE,
        treasureCurrent: this.treasureOpen,
        indexMapCurrent: this.indexMapCurrent,
        valueRowAndColumn: this.ValueRowAndColumn,
      };
      dm_Director.instance.sendDataToSever(this.getListTreasureMap);
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
          this.scheduleOnce(function () {
            this.showPopupMessage(DT_MESENGER.END_MAP);
          }, 7);
        } else {
          this.getListTreasureMap = {
            id: DT_commanID_IP.GET_LIST_TREASURE,
            treasureCurrent: this.treasureOpen,
            indexMapCurrent: this.indexMapCurrent,
            valueRowAndColumn: this.ValueRowAndColumn,
          };
          dm_Director.instance.sendDataToSever(this.getListTreasureMap);
        }
      }
    }
  }

  sendDataToSever_getRecordPlayers() {
    this.getRecordPlayersList = {
      id: DT_commanID_IP.GET_RECORD_PLAYERS,
    };
    dm_Director.instance.sendDataToSever(this.getRecordPlayersList);
  }

  InitTreasure(data: DT_INIT_TREASURE_MODEL) {
    console.log("data map", data);
    this.treasureData = data;
    let listIndexTreasure = this.treasureData.listTreasureStatus;
    let childTreasure = this.TreasureGroup.children;
    for (let i = 0; i < childTreasure.length; i++) {
      if (listIndexTreasure[i] != 0) {
        if (i != this.treasureData.treasureCurrentNotOpen) {
          childTreasure[i].getComponent(Button).interactable = false;
          childTreasure[i].getComponent(Sprite).color = this.whiteColor;
        } else {
          childTreasure[i].getComponent(Button).interactable = true;
          childTreasure[i].getComponent(Sprite).color = this.whiteColor;
        }
      } else {
        childTreasure[i].getComponent(Button).interactable = false;
        childTreasure[i].getComponent(Sprite).color = this.grayColor;
      }
    }
    this.initImageMap(this.treasureData.mapCurrent);
    this.initMapCurrent(this.treasureData.mapCurrent);
  }

  initImageMap(indexMap: number) {
    let imagesPath = DT_path.SPRITE_MAP + "map" + indexMap.toString() + "/spriteFrame";
    console.log("images map path", imagesPath);
    let spriteFrame_map = VDScreenManager.instance.assetBundle.get(imagesPath, SpriteFrame);
    console.log("spriteFrameMap", spriteFrame_map);
    let spriteMap = this.BG_group.getComponent(Sprite);
    spriteMap.spriteFrame = spriteFrame_map;
  }

  initMapCurrent(indexMap: number) {
    let listPosTreasure;
    let listTreasure;
    let childsBG_Group = this.BG_group.children;
    for (let i = 0; i < childsBG_Group.length; i++) {
      let childNodeName = "posGroupMap" + indexMap.toString();
      if (childsBG_Group[i].name == childNodeName) {
        console.log("child name", childsBG_Group[i].name);
        listPosTreasure = childsBG_Group[i].children;
      }
      if (childsBG_Group[i].name == "treasureGroup") {
        listTreasure = childsBG_Group[i].children;
      }
    }
    for (let i = 0; i < listPosTreasure.length; i++) {
      listTreasure[i].setWorldPosition(listPosTreasure[i].getWorldPosition());
    }
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

  initPlayerInfo(data: DT_PLAYER_INFO_MODEL) {
    this.playerInfor_localStorage = {
      id: data.id,
      userName: data.userName,
      avatarID: data.avatarID,
      money: data.money,
    };
    let playerInfoString = JSON.stringify(this.playerInfor_localStorage);
    localStorage.setItem(DT_KEY_WORD.PLAYER_INFO, playerInfoString);
    console.log(data);
    this.initPlayerInfoData = data;
    this.setAvatar(this.initPlayerInfoData.avatarID);
    this.userName.string = data.userName;
    this.coin.string = DT_Global.instance.formatNumberWithCommas(data.money);
  }

  setAvatar(avatarID: number) {
    let avatarName = "avatar" + avatarID.toString();
    let avatarGroupPath = DT_path.AVATAR_TEXTURE_PACKER;
    let texturePacker = VDScreenManager.instance.assetBundle.get(avatarGroupPath, SpriteAtlas);
    let spriteFrameAvatar = texturePacker.getSpriteFrame(avatarName);
    this.avatarUser.spriteFrame = spriteFrameAvatar;
  }

  updateMoneyAfterWithResult(data: DT_sendResultOnclickingThePiece_dataModel) {
    this.resultOnclickPiece = data;
    let clonePlayerInfo: DT_PLAYER_INFO_MODEL = null;
    if (this.resultOnclickPiece.money > 0 && !this.resultOnclickPiece.resultOnClick) {
      this.playerInfor_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      clonePlayerInfo = this.playerInfor_localStorage;
      let coinCurrent = clonePlayerInfo.money - this.resultOnclickPiece.money;
      this.SetDataPlayerInfoInLocalStorage(clonePlayerInfo, coinCurrent);
      this.coin.string = DT_Global.instance.formatNumberWithCommas(this.playerInfor_localStorage.money);
      if (this.playerInfor_localStorage.money < 0) {
        this.showPopupMessage(DT_MESENGER.NOT_MONEY);
      }
      this.sendDataToSever_getRecordPlayers();
    } else if (this.resultOnclickPiece.money > 0 && this.resultOnclickPiece.resultOnClick) {
      this.treasureOpen++;
      this.setDataListTreasureInMap_localStorage(this.treasureOpen, this.indexMapCurrent, this.ValueRowAndColumn);
      this.playerInfor_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      clonePlayerInfo = this.playerInfor_localStorage;
      let coinCurrent = clonePlayerInfo.money + this.resultOnclickPiece.money;
      this.SetDataPlayerInfoInLocalStorage(clonePlayerInfo, coinCurrent);
      this.coin.string = DT_Global.instance.formatNumberWithCommas(this.playerInfor_localStorage.money);
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

  showPopupMessage(message: string) {
    VDScreenManager.instance.showPopupFromPrefabName(
      DT_path.POPUP_NOTIFY,
      (popup: VDBasePopup) => {
        let popupDisplay = popup as dm_PopupNotify;
        popupDisplay.setupPopup(message, [
          () => {
            VDScreenManager.instance.hidePopup(true);
            this.sendDataToSever_GetTreasureInMap();
            dm_Director.instance.setIndexMap(this.indexMapCurrent);
          },
          () => {
            VDScreenManager.instance.hidePopup(true);
            this.onClickBtnBackToScreen1();
          },
        ]);
      },
      true,
      true,
      false
    );
  }
}
