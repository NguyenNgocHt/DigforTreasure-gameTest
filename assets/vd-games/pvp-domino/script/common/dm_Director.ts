import { dm_PlayScreen3 } from "./../screens/dm_PlayScreen3";
import { _decorator, Component, Node } from "cc";
import { dm_PlayScreen } from "../screens/dm_PlayScreen";
import { DigTreasureControler } from "./DigTreasureControler";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../network/DT_networkDefine";
import { DT_INIT_TREASURE_MODEL } from "../model/DT_outputDataModel";
import { DT_initTreaDataFull } from "../model/DT_outputDataFull";
const { ccclass, property } = _decorator;

@ccclass("dm_Director")
export class dm_Director extends Component {
  private static _instance: dm_Director = null!;

  public static get instance(): dm_Director {
    if (this._instance == null) {
      this._instance = new dm_Director();
    }

    return this._instance;
  }
  playScreen: dm_PlayScreen3 | null = null;
  homeScreen: dm_PlayScreen | null = null;
  private initTreasure_dataModel: DT_INIT_TREASURE_MODEL = null;
  public get InitTreasure_dataModel(): DT_INIT_TREASURE_MODEL {
    return this.initTreasure_dataModel;
  }
  start() {
    // this.RegisterEvent();
  }
  public RegisterEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
  }
  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.INIT_TREASURE_TO_DIRECTOR, this.GetInitTreasureDataModel.bind(this));
  }
  GetInitTreasureDataModel(initTreasureDataModel: DT_INIT_TREASURE_MODEL) {
    this.initTreasure_dataModel = initTreasureDataModel;
    console.log("initTreasure_dataModel", this.initTreasure_dataModel);
    this.InitTreasure();
  }
  public InitTreasure() {
    console.log("initTreasure_dataModel", this.initTreasure_dataModel, this.playScreen);
    if (this.playScreen) {
      this.playScreen.InitTreasure(this.initTreasure_dataModel);
    }
  }
  public GetInitTreasureData(): DT_INIT_TREASURE_MODEL {
    if (this.initTreasure_dataModel) {
      return this.initTreasure_dataModel;
    }
  }
}
