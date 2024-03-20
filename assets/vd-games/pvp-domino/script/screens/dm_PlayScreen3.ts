import { DT_commanID_IP } from "./../network/DT_networkDefine";
import { Label, log, Prefab } from "cc";
import { _decorator, Component, Node } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { dm_Popup1 } from "../popups/dm_Popup1";
import { dm_PlayScreen } from "./dm_PlayScreen";
import { dm_Director } from "../common/dm_Director";
import { DigTreasureControler } from "../common/DigTreasureControler";
import { DT_INIT_TREASURE_MODEL } from "../model/DT_outputDataModel";
import { Button } from "cc";
import { Sprite } from "cc";
import { ColorKey } from "cc";
import { color } from "cc";
import { IP_GET_TREASURE_RANDOM_LIST } from "../model/DT_inputDataModel";
import { poolControler } from "../controler/pool/poolControler";
const { ccclass, property } = _decorator;

@ccclass("dm_PlayScreen3")
export class dm_PlayScreen3 extends VDBaseScreen {
  @property(Label)
  lbNotify: Label = null!;
  @property(Node)
  TreasureGroup: Node = null;
  private treasureData: DT_INIT_TREASURE_MODEL = null;
  private IP_getTreasureRandomList: IP_GET_TREASURE_RANDOM_LIST = null;
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
    console.log("indexTreasure", indexTreasure);
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
    DigTreasureControler.instance.InitTreasure();
  }
  InitTreasure(data: DT_INIT_TREASURE_MODEL) {
    console.log("zdfvksjdfgsdfg");
    console.log(data);
    this.treasureData = data;
    let listIndexTreasure = this.treasureData.listTreasureStatus;
    let childTreasure = this.TreasureGroup.children;
    for (let i = 0; i < childTreasure.length; i++) {
      if (listIndexTreasure[i] != 0) {
        childTreasure[i].getComponent(Button).interactable = true;
        childTreasure[i].getComponent(Sprite).color = this.whiteColor;
      } else {
        childTreasure[i].getComponent(Button).interactable = false;
        childTreasure[i].getComponent(Sprite).color = this.grayColor;
      }
    }
  }
}
