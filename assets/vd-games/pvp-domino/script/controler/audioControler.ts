import { dm_PlayScreen } from "./../screens/dm_PlayScreen";
import { _decorator, Component, Node } from "cc";
import { VDAudioManager } from "../../../../vd-framework/audio/VDAudioManager";
import { AudioSource } from "cc";
const { ccclass, property } = _decorator;

@ccclass("audioControler")
export class audioControler extends Component {
  private static _instance: audioControler = null!;
  public static get instance(): audioControler {
    if (this._instance == null) {
      this._instance = new audioControler();
    }

    return this._instance;
  }

  @property(AudioSource)
  boomSound: AudioSource = null;
  @property(AudioSource)
  onClick: AudioSource = null;
  @property(AudioSource)
  win: AudioSource = null;
  @property(AudioSource)
  soundTrack: AudioSource = null;

  onClickEffectBoom() {
    if (this.boomSound) {
      this.boomSound.play();
    }
  }

  soundTrackPlay() {
    this.soundTrack.play();
  }

  onclickSound() {
    this.onClick.play();
  }

  winSound() {
    this.win.play();
  }
}
