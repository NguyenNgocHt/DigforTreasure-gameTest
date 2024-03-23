import { DT_Global } from "./../common/DT_Global";
import { DT_PLAYER_INFO_MODEL } from "./../model/DT_outputDataModel";
import { Prefab } from "cc";
import { _decorator, Component, Node, log, sp, instantiate, resources } from "cc";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { dm_Director } from "../common/dm_Director";
import { Skeleton } from "cc";
import { dm_PlayScreen3 } from "./dm_PlayScreen3";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { DT_KEY_WORD, DT_path } from "../common/DT_define";
import { Label } from "cc";
import { labelAssembler } from "cc";
import { Sprite } from "cc";
import { SpriteFrame } from "cc";
import { SpriteAtlas } from "cc";
const { ccclass, property } = _decorator;

@ccclass("dm_PlayScreen")
export class dm_PlayScreen extends VDBaseScreen {
  @property(Label)
  playerName: Label = null;
  @property(Label)
  coin: Label = null;
  @property(Sprite)
  playerSprite: Sprite = null;
  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;
  playerInfor_localStogare: DT_PLAYER_INFO_MODEL = null;
  onLoad() {
    this.CallinitPlayerInfo();
  }
  
  CallinitPlayerInfo() {
    if (localStorage.getItem(DT_KEY_WORD.PLAYER_INFO) == null) {
      this.showGetNamePlayerPopup();
    } else {
      this.playerInfor_localStogare = JSON.parse(localStorage.getItem(DT_KEY_WORD.PLAYER_INFO));
      dm_Director.instance.sendPlayerNameData(this.playerInfor_localStogare.userName);
    }
  }
  onClickBtnNext() {
    let pfFxCloud = VDScreenManager.instance.assetBundle.get("res/prefabs/transition/transition_cloud", Prefab)!;
    let nodeCloud = instantiate(pfFxCloud);
    VDScreenManager.instance.showEffect(nodeCloud);

    let spineCloud = nodeCloud.getComponent(sp.Skeleton);
    let entry = spineCloud.setAnimation(0, "transition_to_lucky", false);

    spineCloud.setTrackCompleteListener(entry, (x: any, ev: any) => {
      VDScreenManager.instance.removeAllEffects();
    });

    spineCloud.setTrackEventListener(entry, (x: any, ev: any) => {
      if (ev && ev.data && ev.data.name && ev.data.name == "transition") {
        let play_screen = VDScreenManager.instance.assetBundle.get("res/prefabs/screen/play_screen_3", Prefab)!;
        VDScreenManager.instance.pushScreen(
          play_screen,
          (screen: VDBaseScreen) => {
            dm_Director.instance.playScreen = screen as dm_PlayScreen3;
          },
          false
        );
      }
    });
  }

  showGetNamePlayerPopup() {
    VDScreenManager.instance.showPopupFromPrefabName(
      DT_path.GET_PLAYER_NAME_POPUP,
      (popup: VDBasePopup) => {
        let callbacks = [
          () => {
            VDScreenManager.instance.hidePopup(true);
          },
        ];
      },
      false,
      true,
      true
    );
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
    this.playerName.string = data.userName;
    this.coin.string = DT_Global.instance.formatNumberWithCommas(data.money);
  }

  setAvatar(avatarID: number) {
    let avatarName = "avatar" + avatarID.toString();
    let avatarGroupPath = DT_path.AVATAR_TEXTURE_PACKER;
    console.log("avatar path", avatarGroupPath);
    let texturePacker = VDScreenManager.instance.assetBundle.get(avatarGroupPath, SpriteAtlas);
    console.log("sprite frame", texturePacker);
    let spriteFrameAvatar = texturePacker.getSpriteFrame(avatarName);
    this.playerSprite.spriteFrame = spriteFrameAvatar;
  }
}
