import { _decorator, Component, Node } from "cc";
import { VDAudioManager } from "../../../../vd-framework/audio/VDAudioManager";
const { ccclass, property } = _decorator;

@ccclass("audioControler")
export class audioControler extends Component {
  //#region BGM
  onClickPlayBGM() {
    console.log("onclick play audio");
    VDAudioManager.instance.playBGM("dm_bgm_main");
  }
  //#endregion
  //#region Clip

  onClickPlayClip() {
    VDAudioManager.instance.playClip("dm_bgm_win", false);
  }

  onClickStopClip() {
    VDAudioManager.instance.stopClip();
  }
  //#endregion

  //#region Effect
  onClickPlayEffect() {
    VDAudioManager.instance.playEffect("dm_sfx_appear", false);
  }
  onClickEffectBoom() {
    VDAudioManager.instance.playEffect("sound_handbomb", false);
  }
  onClickStopEffect() {
    VDAudioManager.instance.stopEffectByName("dm_sfx_appear");
  }
  //#endregion
}
