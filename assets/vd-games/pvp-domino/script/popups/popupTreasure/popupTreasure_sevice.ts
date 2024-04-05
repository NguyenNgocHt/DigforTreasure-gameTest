import { _decorator, Node } from "cc";
import { DT_commandID_OP, DT_GAME_STATUS_EVENT } from "../../network/NetworkDefine";
import { I_popup1_svice } from "../../common/InterfaceDefine";
import { DT_listRandomLocationTreasure_dataModel } from "../../model/OutputDataModel";
import { VDEventListener } from "../../../../../vd-framework/common/VDEventListener";
import { DT_sendResultOnclickingThePiece_dataModel } from "../../model/OutputDataModel";
import { Global } from "../../common/Global";

const { ccclass, property } = _decorator;

@ccclass("popupTreasure_sevice")
export class popupTreasure_sevice implements I_popup1_svice {
  private static _instance: popupTreasure_sevice | null = null;
  public static get instance(): popupTreasure_sevice {
    if (this._instance == null) {
      this._instance = new popupTreasure_sevice();
    }
    return this._instance;
  }

  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  listIconNode: Node[] = [];

  getDataFromGamePlayScreen(data) {
    let dataID = data.id;
    switch (dataID) {
      case DT_commandID_OP.DT_RESULT_ONCLICK_TREASURE:
        this.showResultOnClickToPiece(data);
    }
  }

  getDataFromGamePlayScreen_initLocationTreasure(data: DT_listRandomLocationTreasure_dataModel, listNode: Node[]) {
    this.getListIconNode(listNode);
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SEND_TO_POPUP1_CTR_LIST_RANDOM_LOCATION_TREASURE, data, listNode);
  }

  getListIconNode(listNode) {
    this.listIconNode = [];
    this.listIconNode = listNode;
  }

  showResultOnClickToPiece(data: DT_sendResultOnclickingThePiece_dataModel): void {
    console.log(data);
    this.resultOnclickPiece = {
      id: data.id,
      indexInArr: data.indexInArr,
      countOnClick: data.countOnClick,
      resultOnClick: data.resultOnClick,
      money: data.money,
    };
    let resultOnclickPiece = this.resultOnclickPiece.resultOnClick;

    if (resultOnclickPiece) {
      for (let i = 0; i < this.listIconNode.length; i++) {
        if (i == this.resultOnclickPiece.indexInArr) {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_TREASURE_OPEN, this.resultOnclickPiece.money, i);
        } else {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, i);

          setTimeout(function () {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
          }, (Global.instance.RandomNumber(200, 300) / 100) * 1000);
        }
      }
    } else {
      if (this.resultOnclickPiece.countOnClick === 3) {
        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.DIG_END, data.money);
        for (let i = 0; i < this.listIconNode.length; i++) {
          if (i == this.resultOnclickPiece.indexInArr) {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
          } else {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, i);

            setTimeout(function () {
              VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
            }, (Global.instance.RandomNumber(10, 300) / 100) * 1000);
          }
        }
      } else {
        for (let i = 0; i < this.listIconNode.length; i++) {
          if (i == this.resultOnclickPiece.indexInArr) {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
          }
        }
      }
    }
  }
}
