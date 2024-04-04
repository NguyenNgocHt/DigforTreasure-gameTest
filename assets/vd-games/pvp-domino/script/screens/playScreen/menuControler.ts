import { _decorator, Component } from "cc";
import VDScreenManager from "../../../../../vd-framework/ui/VDScreenManager";
import { I_menuControler, I_playScreen } from "../../common/dt_interfaceDefine";
import { DT_path } from "../../common/DT_define";
import VDBasePopup from "../../../../../vd-framework/ui/VDBasePopup";
import { VDEventListener } from "../../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../../network/DT_networkDefine";

const { ccclass, property } = _decorator;

@ccclass("menuControler")
export class menuControler extends Component implements I_menuControler {
  private _i_gamePlayControler: I_playScreen = null;

  public setVarInterface(gamePlayCtr: I_playScreen) {
    this._i_gamePlayControler = gamePlayCtr;
  }

  onClickBtnBackToScreen1() {
    console.log(`onClickBtnBackToScreen1 1`);
    VDScreenManager.instance.popToRootScreen();
    VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.GET_PLAYER_INFO_TO_HOME);
  }

  onClickBtnShowTableView() {
    VDScreenManager.instance.showPopupFromPrefabName(DT_path.POPUP_TABLE_VIEW, (popup: VDBasePopup) => {}, true, true, true);
    this.scheduleOnce(function () {
      VDEventListener.dispatchEvent(DT_GAME_STATUS_EVENT.INIT_RECORD_PLAYERS);
    }, 0.1);
  }
}
