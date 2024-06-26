import { PLAYER_NAME_DATA } from "./../model/InputDataModel";
import { EditBox } from "cc";
import { _decorator, Component, Node } from "cc";
import { Director } from "../common/Director";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { I_director } from "../common/InterfaceDefine";
import { DT_commanID_IP } from "../network/NetworkDefine";
const { ccclass, property } = _decorator;

@ccclass("GetPlayerName")
export class GetPlayerName extends Component {
  @property(EditBox)
  Edit_Box_PlayerName: EditBox = null;
  private _i_director: I_director = null;
  private playerNameDataModel: PLAYER_NAME_DATA = null;

  setVarInterface(director: I_director) {
    this._i_director = director;
  }
  onClickGetPlayerName() {
    this.setVarInterface(Director.instance);
    let nickName = null;
    if (this.Edit_Box_PlayerName) {
      nickName = this.Edit_Box_PlayerName.string;
      console.log("nickName", nickName);
      localStorage.setItem("NICK-NAME", nickName);
      this.playerNameDataModel = {
        id: DT_commanID_IP.PLAYER_NAME_ID,
        playerName: nickName,
      };
      this._i_director.sendDataToSever(this.playerNameDataModel);
      VDScreenManager.instance.hidePopup(false);
    }
  }
}
