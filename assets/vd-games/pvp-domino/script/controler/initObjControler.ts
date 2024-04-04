import { _decorator, Component, Node, color, Button, Sprite, SpriteFrame } from "cc";
import { DT_INIT_TREASURE_MODEL } from "../model/DT_outputDataModel";
import { DT_path } from "../common/DT_define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { DT_PLAYER_INFO_MODEL } from "../model/DT_outputDataModel";
import { I_initObjControler, I_playScreen } from "../common/dt_interfaceDefine";

const { ccclass, property } = _decorator;

@ccclass("initObjControler")
export class initObjControler extends Component implements I_initObjControler {
  @property(Node)
  TreasureGroup: Node = null;

  @property(Node)
  BG_group: Node = null;

  playerInfor_localStorage: DT_PLAYER_INFO_MODEL = null;
  private treasureData: DT_INIT_TREASURE_MODEL = null;
  initPlayerInfoData: DT_PLAYER_INFO_MODEL = null;

  private grayColor = color(128, 128, 128);
  private whiteColor = color(255, 255, 255);

  private _i_gamePlayControler: I_playScreen = null;

  public setVarInterface(playGameControler: I_playScreen) {
    this._i_gamePlayControler = playGameControler;
  }

  init_treasure(data: DT_INIT_TREASURE_MODEL): void {
    console.log("data map", data);
    this.treasureData = data;
    let listIndexTreasure = this.treasureData.listTreasureStatus;
    let childTreasure = this.TreasureGroup.children;
    for (let i = 0; i < childTreasure.length; i++) {
      if (listIndexTreasure[i] != 0) {
        if (i != this.treasureData.treasureCurrentNotOpen) {
          childTreasure[i].getComponent(Button).interactable = false;
          childTreasure[i].getComponent(Sprite).color = this.whiteColor;
        } else {
          childTreasure[i].getComponent(Button).interactable = true;
          childTreasure[i].getComponent(Sprite).color = this.whiteColor;
        }
      } else {
        childTreasure[i].getComponent(Button).interactable = false;
        childTreasure[i].getComponent(Sprite).color = this.grayColor;
      }
    }
    this.initImageMap(this.treasureData.mapCurrent);
    this.initMapCurrent(this.treasureData.mapCurrent);
  }

  initImageMap(indexMap: number) {
    let imagesPath = DT_path.SPRITE_MAP + "map" + indexMap.toString() + "/spriteFrame";
    console.log("images map path", imagesPath);
    let spriteFrame_map = VDScreenManager.instance.assetBundle.get(imagesPath, SpriteFrame);
    console.log("spriteFrameMap", spriteFrame_map);
    let spriteMap = this.BG_group.getComponent(Sprite);
    spriteMap.spriteFrame = spriteFrame_map;
  }

  initMapCurrent(indexMap: number) {
    let listPosTreasure;
    let listTreasure;
    let childsBG_Group = this.BG_group.children;
    for (let i = 0; i < childsBG_Group.length; i++) {
      let childNodeName = "posGroupMap" + indexMap.toString();
      if (childsBG_Group[i].name == childNodeName) {
        console.log("child name", childsBG_Group[i].name);
        listPosTreasure = childsBG_Group[i].children;
      }
      if (childsBG_Group[i].name == "treasureGroup") {
        listTreasure = childsBG_Group[i].children;
      }
    }
    for (let i = 0; i < listPosTreasure.length; i++) {
      listTreasure[i].setWorldPosition(listPosTreasure[i].getWorldPosition());
    }
  }
}
