import { _decorator, Component, Node } from "cc";
import { DT_commandID_OP, DT_GAME_STATUS_EVENT } from "../../network/DT_networkDefine";
import { I_popup1_svice } from "../../common/dt_interfaceDefine";
import { DT_listRandomLocationTreasure_dataModel } from "../../model/DT_outputDataModel";
import { VDEventListener } from "../../../../../vd-framework/common/VDEventListener";
import { DT_sendResultOnclickingThePiece_dataModel } from "../../model/DT_outputDataModel";
import { DT_Global } from "../../common/DT_Global";

const { ccclass, property } = _decorator;

@ccclass("popup1_sevice")
export class popup1_sevice extends Component implements I_popup1_svice {
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
      setTimeout(function () {
        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.PUSH_ICON_NODE_TO_POOL_GROUP);

        VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.HIDE_POPUP);
      }, 8000);

      for (let i = 0; i < this.listIconNode.length; i++) {
        if (i == this.resultOnclickPiece.indexInArr) {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_TREASURE_OPEN, this.resultOnclickPiece.money, i);

          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.AUDIO_WINGAME);
        } else {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, i);

          setTimeout(function () {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);

            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, i);
          }, (DT_Global.instance.RandomNumber(200, 300) / 100) * 1000);
        }
      }
    } else {
      if (this.resultOnclickPiece.countOnClick === 3) {
        setTimeout(function () {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.PUSH_ICON_NODE_TO_POOL_GROUP);

          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.HIDE_POPUP);
        }, 6000);

        setTimeout(function () {
          VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_POINT_LOSE, data.money);
        }, 2000);

        for (let i = 0; i < this.listIconNode.length; i++) {
          if (i == this.resultOnclickPiece.indexInArr) {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, i);

            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
          } else {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, i);

            setTimeout(function () {
              VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, i);

              VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
            }, (DT_Global.instance.RandomNumber(10, 300) / 100) * 1000);
          }
        }
      } else {
        for (let i = 0; i < this.listIconNode.length; i++) {
          if (i == this.resultOnclickPiece.indexInArr) {
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, i);

            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, i);
          }
        }
      }
    }
  }
}
