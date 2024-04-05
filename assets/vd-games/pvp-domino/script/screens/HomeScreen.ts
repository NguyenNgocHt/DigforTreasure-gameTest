import { DT_PLAYER_INFO_MODEL } from "./../model/OutputDataModel";
import { Prefab } from "cc";
import { _decorator, sp, instantiate } from "cc";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { Director } from "../common/Director";
import { PlayScreen } from "./PlayScreen";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { DT_KEY_WORD, DT_path } from "../common/Define";
import { Label } from "cc";
import { Sprite } from "cc";
import { I_homeScreen, I_playerView } from "../common/InterfaceDefine";
import { playerView } from "./playScreen/playerView";
import { PLAYER_NAME_DATA } from "../model/InputDataModel";
import { DT_commanID_IP } from "../network/NetworkDefine";

const { ccclass, property } = _decorator;

@ccclass("HomeScreen")
export class HomeScreen extends VDBaseScreen implements I_homeScreen {
  @property(Label)
  playerName: Label = null;
  @property(Label)
  coin: Label = null;
  @property(Sprite)
  playerSprite: Sprite = null;
  @property(playerView)
  playerView: playerView = null;

  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;
  playerInfor_localStogare: DT_PLAYER_INFO_MODEL = null;
  private playerNameDataModel: PLAYER_NAME_DATA = null;
  private _i_playerView: I_playerView = null;
  onLoad() {
    //MVC
    this.CallinitPlayerInfo();

    //controller.OnLoad();
  }
  /*
   *OnLoad()
   */

  CallinitPlayerInfo(): void {
    this.setVarInterface(this.playerView);
    const json = localStorage.getItem(DT_KEY_WORD.PLAYER_INFO);

    if (json == null) {
      this.showGetNamePlayerPopup();
    } else {
      this.playerInfor_localStogare = JSON.parse(json);
      this.playerNameDataModel = {
        id: DT_commanID_IP.PLAYER_NAME_ID,
        playerName: this.playerInfor_localStogare.userName,
      };
      Director.instance.sendDataToSever(this.playerNameDataModel);
    }
  }

  setVarInterface(playerView: I_playerView) {
    console.log("start come in");
    this._i_playerView = playerView;
  }

  onClickBtnNext() {
    let pfFxCloud = VDScreenManager.instance.assetBundle.get(DT_path.TRANSITION_CLOUD, Prefab)!;
    let nodeCloud = instantiate(pfFxCloud);
    VDScreenManager.instance.showEffect(nodeCloud);

    let spineCloud = nodeCloud.getComponent(sp.Skeleton);
    let entry = spineCloud.setAnimation(0, "transition_to_lucky", false);

    spineCloud.setTrackCompleteListener(entry, (x: any, ev: any) => {
      VDScreenManager.instance.removeAllEffects();
    });

    spineCloud.setTrackEventListener(entry, (x: any, ev: any) => {
      if (ev && ev.data && ev.data.name && ev.data.name == "transition") {
        let play_screen = VDScreenManager.instance.assetBundle.get(DT_path.PLAY_SCREEN_3, Prefab)!;
        VDScreenManager.instance.pushScreen(
          play_screen,
          (screen: VDBaseScreen) => {
            Director.instance.playScreen = screen as PlayScreen;
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

  initPlayerInfo(data: DT_PLAYER_INFO_MODEL): void {
    console.log("come in", this._i_playerView);
    this._i_playerView.init_playerInfo(data);
  }
}
