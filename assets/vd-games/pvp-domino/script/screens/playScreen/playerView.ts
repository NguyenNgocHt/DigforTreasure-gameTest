import { _decorator, Component, Label, Sprite, SpriteAtlas } from "cc";
import { DT_PLAYER_INFO_MODEL } from "../../model/OutputDataModel";
import { DT_KEY_WORD } from "../../common/Define";
import { Global } from "../../common/Global";
import { DT_path } from "../../common/Define";
import VDScreenManager from "../../../../../vd-framework/ui/VDScreenManager";
import { I_playerView } from "../../common/InterfaceDefine";
const { ccclass, property } = _decorator;

@ccclass("playerView")
export class playerView extends Component implements I_playerView {
  @property(Sprite)
  avatarUser: Sprite = null;

  @property(Label)
  userName: Label = null;

  @property(Label)
  coin: Label = null;

  playerInfor_localStorage: DT_PLAYER_INFO_MODEL = null;
  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;

  init_playerInfo(data: DT_PLAYER_INFO_MODEL): void {
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
    this.coin.string = Global.instance.formatNumberWithCommas(data.money);
  }

  setAvatar(avatarID: number) {
    let avatarName = "avatar" + avatarID.toString();
    let avatarGroupPath = DT_path.AVATAR_TEXTURE_PACKER;
    let texturePacker = VDScreenManager.instance.assetBundle.get(avatarGroupPath, SpriteAtlas);
    let spriteFrameAvatar = texturePacker.getSpriteFrame(avatarName);
    this.avatarUser.spriteFrame = spriteFrameAvatar;
  }

  showCoinWinLose(coin: number) {
    this.coin.string = Global.instance.formatNumberWithCommas(coin);
  }
}
