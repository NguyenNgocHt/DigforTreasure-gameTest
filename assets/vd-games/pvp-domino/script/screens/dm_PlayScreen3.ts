import { DT_commanID_IP } from "./../network/DT_networkDefine";
import { Label, log, Prefab, SpriteAtlas } from "cc";
import { _decorator, Component, Node } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { dm_Popup1 } from "../popups/dm_Popup1";
import { dm_PlayScreen } from "./dm_PlayScreen";
import { dm_Director } from "../common/dm_Director";
import { DigTreasureControler } from "../common/DigTreasureControler";
import { DT_INIT_TREASURE_MODEL, DT_PLAYER_INFO_MODEL, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { Button } from "cc";
import { Sprite } from "cc";
import { color } from "cc";
import { IP_GET_LIST_TREASURE_MAP, IP_GET_TREASURE_RANDOM_LIST } from "../model/DT_inputDataModel";
import { DT_path } from "../common/DT_define";
import { dm_PopupNotify } from "../popups/dm_PopupNotify";
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
  private treasureData: DT_INIT_TREASURE_MODEL = null;
  private IP_getTreasureRandomList: IP_GET_TREASURE_RANDOM_LIST = null;
  playerInfor_localStogare: DT_PLAYER_INFO_MODEL = null;
  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;
  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  getListTreasureMap: IP_GET_LIST_TREASURE_MAP = null;
  treasureOpen: number = 0;
  private grayColor = color(128, 128, 128);
  private whiteColor = color(255, 255, 255);
  start() {
    this.scheduleOnce(function () {
      this.initTreasureInMap();
    }, 0.2);
  }
  onClickBtnBackToScreen1() {
    log(`onClickBtnBackToScreen1 1`);
    VDScreenManager.instance.popToRootScreen();
    // VDScreenManager.instance.popToScreen(dm_PlayScreen);
    // VDScreenManager.instance.popToScreen('dm_PlayScreen');
  }

  onClickBtnShowPopup(event: TouchEvent, indexTreasure: number) {
    VDScreenManager.instance.showPopupFromPrefabName(
      "res/prefabs/popup/popup_1",
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
    dm_Director.instance.sendGetListRandomTreasure(this.IP_getTreasureRandomList);
  }

  onClickBtnShowTableView() {
    VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_table_view", (popup: VDBasePopup) => {}, true, true, true);
  }
  initTreasureInMap() {
    this.getListTreasureMap = {
      id: DT_commanID_IP.GET_LIST_TREASURE,
      treasureCurrent: this.treasureOpen,
    };
    dm_Director.instance.send_getListTreasureInMap(this.getListTreasureMap);
  }
  InitTreasure(data: DT_INIT_TREASURE_MODEL) {
    console.log("zdfvksjdfgsdfg");
    console.log(data);
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
  }
  initPlayerInfo(data: DT_PLAYER_INFO_MODEL) {
    this.playerInfor_localStogare = {
      id: data.id,
      userName: data.userName,
      avatarID: data.avatarID,
      money: data.money,
    };
    let playerInfoString = JSON.stringify(this.playerInfor_localStogare);
    localStorage.setItem("PLAYER-INFO", playerInfoString);
    console.log(data);
    this.initPlayerInfoData = data;
    this.setAvatar(this.initPlayerInfoData.avatarID);
    this.userName.string = data.userName;
    this.coin.string = data.money.toString();
  }
  setAvatar(avatarID: number) {
    let avatarName = "avatar" + avatarID.toString();
    let avatarGroupPath = DT_path.AVATAR_TEXTURE_PACKER;
    console.log("avatar path", avatarGroupPath);
    let texturePacker = VDScreenManager.instance.assetBundle.get(avatarGroupPath, SpriteAtlas);
    console.log("sprite frame", texturePacker);
    let spriteFrameAvatar = texturePacker.getSpriteFrame(avatarName);
    this.avatarUser.spriteFrame = spriteFrameAvatar;
  }
  updateMoneyAfterWithResult(data: DT_sendResultOnclickingThePiece_dataModel) {
    this.resultOnclickPiece = data;
    let clonePlayerInfo: DT_PLAYER_INFO_MODEL = null;
    if (this.resultOnclickPiece.money > 0 && !this.resultOnclickPiece.resultOnClick) {
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem("PLAYER-INFO"));
      clonePlayerInfo = this.playerInfor_localStogare;
      if (this.playerInfor_localStogare) {
        this.playerInfor_localStogare = {
          id: clonePlayerInfo.id,
          userName: clonePlayerInfo.userName,
          avatarID: clonePlayerInfo.avatarID,
          money: clonePlayerInfo.money - this.resultOnclickPiece.money,
        };
      }
      localStorage.setItem("PLAYER-INFO", JSON.stringify(this.playerInfor_localStogare));
      this.coin.string = this.playerInfor_localStogare.money.toString();
      if (this.playerInfor_localStogare.money < 0) {
        this.showPopupMessage("số tiền của bạn không đủ để tiếp tục chơi! hãy nạp tiền để tiếp tục");
      }
      console.log("tru tien");
    } else if (this.resultOnclickPiece.money > 0 && this.resultOnclickPiece.resultOnClick) {
      this.treasureOpen++;
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem("PLAYER-INFO"));
      clonePlayerInfo = this.playerInfor_localStogare;
      if (this.playerInfor_localStogare) {
        this.playerInfor_localStogare = {
          id: clonePlayerInfo.id,
          userName: clonePlayerInfo.userName,
          avatarID: clonePlayerInfo.avatarID,
          money: clonePlayerInfo.money + this.resultOnclickPiece.money,
        };
      }
      localStorage.setItem("PLAYER-INFO", JSON.stringify(this.playerInfor_localStogare));
      console.log("money", this.playerInfor_localStogare.money);
      this.coin.string = this.playerInfor_localStogare.money.toString();
      this.initTreasureInMap();
      console.log("cong tien");
    }
  }
  showPopupMessage(message: string) {
    VDScreenManager.instance.showPopupFromPrefabName(
      "res/prefabs/popup/popup_notify",
      (popup: VDBasePopup) => {
        let popupDisplay = popup as dm_PopupNotify;
        popupDisplay.setupPopup(message, [
          () => {
            VDScreenManager.instance.hidePopup(true);
            this.onClickBtnBackToScreen1();
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
