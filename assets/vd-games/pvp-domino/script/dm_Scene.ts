import { _decorator, Component, log, assetManager, Prefab } from "cc";
import VDAsyncTaskMgr from "../../../vd-framework/async-task/VDAsyncTaskMgr";
import { VDAudioManager } from "../../../vd-framework/audio/VDAudioManager";
import VDScreenManager from "../../../vd-framework/ui/VDScreenManager";
import { DigTreasureControler } from "./common/DigTreasureControler";
import { DT_eventListenner } from "./eventListener/DT_eventListenner";
import { dm_Director } from "./common/dm_Director";
import { dm_Config } from "./common/dm_Config";
import { DT_sendDataToSever } from "./eventListener/DT_sendDataToSever";
import { DT_Global } from "./common/DT_Global";
import { DT_KEY_WORD } from "./common/DT_define";
import { DT_listTreasureMap_LocalStorage } from "./common/dm_Config";
const { ccclass, property } = _decorator;

@ccclass("dm_Scene")
export class dm_Scene extends Component {
  listTreasureMap_localStorage: DT_listTreasureMap_LocalStorage = null;
  onLoad() {
    this.listTreasureMap_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP));
    DT_eventListenner.instance.RegisterEvent();
    dm_Director.instance.RegisterEvent();
    DigTreasureControler.instance.RegisterEvent();
    DigTreasureControler.instance.initListMoneyInTreasure(
      DT_Global.instance.moneyWinOrigin * this.listTreasureMap_localStorage.indexMapCurrent,
      DT_Global.instance.moneyLoseOrigin * this.listTreasureMap_localStorage.indexMapCurrent
    );
    DigTreasureControler.instance.initPlayerOtherInfo();
    DT_sendDataToSever.instance.RegisterEvent();
    log("@ dm_Scene: onLoad  !!!");
    let bundle = assetManager.getBundle("bundle_" + dm_Config.GAME_NAME);
    if (bundle) {
      this.node.addComponent(VDScreenManager);
      VDScreenManager.instance.assetBundle = bundle;
      VDScreenManager.instance.setupCommon();

      bundle.load("res/prefabs/screen/loading_screen", Prefab, (error, prefab) => {
        if (error) {
          log(`bundle.load: ${error}`);
        } else {
          log("load loading sucess");
          // VDScreenManager.instance.initWithRootScreen(prefab);
          VDScreenManager.instance.pushScreen(prefab, (screen) => {
            log("pushScreen " + screen.name + " success!");
          });
        }
      });
    }
  }

  onDestroy() {
    VDAudioManager.instance.destroy();
    VDAsyncTaskMgr.instance.stop();
    DigTreasureControler.instance.OffEvent();
    DT_eventListenner.instance.offEvent();
    DT_sendDataToSever.instance.offEvent();
    dm_Director.instance.offEvent();
  }
}
