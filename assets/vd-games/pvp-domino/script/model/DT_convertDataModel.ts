import { _decorator, Component, Node } from "cc";
import { DT_initTreaDataFull } from "./DT_outputDataFull";
import { DT_INIT_TREASURE_MODEL } from "./DT_outputDataModel";
const { ccclass, property } = _decorator;

@ccclass("DT_convertDataModel")
export class DT_convertDataModel {
  static buildInitTreasure(treasureData: DT_initTreaDataFull): DT_INIT_TREASURE_MODEL {
    const treasure_data: DT_INIT_TREASURE_MODEL = {
      id: treasureData.ID,
      listTreasureStatus: treasureData.L,
    };
    return treasure_data;
  }
}
