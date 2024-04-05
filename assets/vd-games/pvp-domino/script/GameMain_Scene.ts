import { _decorator, Component, log, assetManager, Prefab } from "cc";
import VDAsyncTaskMgr from "../../../vd-framework/async-task/VDAsyncTaskMgr";
import { VDAudioManager } from "../../../vd-framework/audio/VDAudioManager";
import VDScreenManager from "../../../vd-framework/ui/VDScreenManager";
import { DigTreasureControler } from "./common/DigTreasureControler";
import { EventListenner } from "./eventListener/EventListenner";
import { Director } from "./common/Director";
import { dm_Config } from "./common/Config";
import { SendDataToSever } from "./eventListener/SendDataToSever";
import { Global } from "./common/Global";
import { DT_KEY_WORD } from "./common/Define";
import { DT_listTreasureMap_LocalStorage } from "./common/Config";
const { ccclass, property } = _decorator;

@ccclass("dm_Scene")
export class dm_Scene extends Component {
  listTreasureMap_localStorage: DT_listTreasureMap_LocalStorage = null;
  onLoad() {
    this.listTreasureMap_localStorage = JSON.parse(localStorage.getItem(DT_KEY_WORD.LIST_TREASURE_IN_MAP));
    EventListenner.instance.RegisterEvent();
    Director.instance.RegisterEvent();
    DigTreasureControler.instance.RegisterEvent();
    DigTreasureControler.instance.initListMoneyInTreasure(
      Global.instance.moneyWinOrigin * this.listTreasureMap_localStorage.indexMapCurrent,
      Global.instance.moneyLoseOrigin * this.listTreasureMap_localStorage.indexMapCurrent
    );
    DigTreasureControler.instance.initPlayerOtherInfo();
    SendDataToSever.instance.RegisterEvent();
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
    EventListenner.instance.offEvent();
    SendDataToSever.instance.offEvent();
    Director.instance.offEvent();
  }
}
