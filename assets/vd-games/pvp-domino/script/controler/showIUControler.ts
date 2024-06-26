import { I_playScreen } from "./../common/InterfaceDefine";
import { _decorator, Component } from "cc";
import { DT_path } from "../common/Define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { PopupNotify } from "../popups/PopupNotify";
import { PopupTreasure } from "../popups/PopupTreasure";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../network/NetworkDefine";

const { ccclass, property } = _decorator;

@ccclass("showIUControler")
export class showIUControler extends Component {
  private _i_gamePlayControler: I_playScreen = null;

  public setVarInterface(gamePlayCtr: I_playScreen) {
    this._i_gamePlayControler = gamePlayCtr;
  }
  showPopupMessage(message: string) {
    VDScreenManager.instance.showPopupFromPrefabName(
      DT_path.POPUP_NOTIFY,
      (popup: VDBasePopup) => {
        let popupDisplay = popup as PopupNotify;
        popupDisplay.setupPopup(message, [
          () => {
            VDScreenManager.instance.hidePopup(true);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_RECORD_PLAYERS);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SET_INDEX_MAP);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.SET_LIST_MONEY_WIN_LOSE);
            VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_THE_NEXT_TREASURE_ON_THE_MAP);
          },
          () => {
            VDScreenManager.instance.hidePopup(true);
            this._i_gamePlayControler.callMenuGroup_onClickBtnBackToScreen1();
          },
        ]);
      },
      true,
      true,
      false
    );
  }

  onClickBtnShowPopup(event: TouchEvent, indexTreasure: number) {
    VDScreenManager.instance.showPopupFromPrefabName(
      DT_path.POPUP_1,
      (popup: VDBasePopup) => {
        console.log("show popup");
        let popupWin = popup as PopupTreasure;
        popupWin.finishedCallback = () => {
          console.log(" Just Closed Popup !!!");
        };
      },
      true,
      true,
      true
    );
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_LIST_RANDOM_TREASURE, indexTreasure);
  }
}
