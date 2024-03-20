import { EditBox } from "cc";
import { _decorator, Component, Node } from "cc";
import { dm_Director } from "../common/dm_Director";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
const { ccclass, property } = _decorator;

@ccclass("DT_getPlayerName")
export class DT_getPlayerName extends Component {
  @property(EditBox)
  Edit_Box_PlayerName: EditBox = null;
  onClickGetPlayerName() {
    let nickName = null;
    if (this.Edit_Box_PlayerName) {
      nickName = this.Edit_Box_PlayerName.string;
      console.log("nickName", nickName);
      localStorage.setItem("NICK-NAME", nickName);
      dm_Director.instance.sendPlayerNameData(nickName);
      VDScreenManager.instance.hidePopup(false);
    }
  }
}
