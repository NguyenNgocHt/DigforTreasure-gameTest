import { _decorator, Component, Node, SpriteFrame, Sprite, Vec3, Label, tween } from "cc";
import { DT_listRandomLocationTreasure_dataModel } from "../../model/OutputDataModel";
import { DT_path } from "../../common/Define";
import VDScreenManager from "../../../../../vd-framework/ui/VDScreenManager";
import { pieceControler } from "../../controler/pieceControler";
import { I_popup1_view } from "../../common/InterfaceDefine";
const { ccclass, property } = _decorator;

@ccclass("popup1_view")
export class popup1_view extends Component implements I_popup1_view {
  @property(Label)
  showPointLose: Label = null;
  @property(Sprite)
  BG_popup1: Sprite = null;
  @property(Node)
  PosStart: Node = null;
  @property(Node)
  pieceParent: Node = null;

  listIconNode: Node[] = [];
  listLocationPiece: DT_listRandomLocationTreasure_dataModel = null;

  distance_2_icon: number = 150;

  public initTableTreasure(data: DT_listRandomLocationTreasure_dataModel, listNode: Node[]): void {
    this.listIconNode = [];
    let listIconNode = listNode;
    this.listIconNode = listIconNode;
    console.log("data !!!!!!!!!!!!!!!!!!!!!!!!!!", data);
    this.listLocationPiece = {
      id: data.id,
      listRandomLocationTreasure: data.listRandomLocationTreasure,
      indexMapCurrent: data.indexMapCurrent,
      valueRowAndColumn: data.valueRowAndColumn,
    };
    this.setMapPopup1(this.listLocationPiece.indexMapCurrent);
    let posStart = this.PosStart.getWorldPosition();
    let posStartClone = posStart;
    if (this.listLocationPiece.valueRowAndColumn == 3) {
      posStart = posStartClone;
      this.distance_2_icon = 150;
    } else if (this.listLocationPiece.valueRowAndColumn == 4) {
      posStart = new Vec3(posStartClone.x - 70, posStartClone.y + 115, 0);
      this.distance_2_icon = 140;
    } else if (this.listLocationPiece.valueRowAndColumn == 5) {
      posStart = new Vec3(posStartClone.x - 90, posStartClone.y + 130, 0);
      this.distance_2_icon = 120;
    }
    let listLocation = this.listLocationPiece.listRandomLocationTreasure;
    console.log("list location", listLocation, this.listLocationPiece);
    for (let i = 0; i < this.listLocationPiece.valueRowAndColumn; i++) {
      for (let j = 0; j < this.listLocationPiece.valueRowAndColumn; j++) {
        let k = i * this.listLocationPiece.valueRowAndColumn + j;

        let pieceControler = listIconNode[k].getComponent("pieceControler") as pieceControler;
        pieceControler.setPiceIndex(listLocation[k], k);
        this.pieceParent.addChild(listIconNode[k]);
        listIconNode[k].setWorldPosition(posStart.x + j * this.distance_2_icon, posStart.y - i * this.distance_2_icon, 0);
        if (this.listLocationPiece.valueRowAndColumn == 3) {
          listIconNode[k].setScale(1, 1, 1);
          this.setPieceColor(listIconNode[k], 1);
        } else if (this.listLocationPiece.valueRowAndColumn == 4) {
          listIconNode[k].setScale(0.9, 0.9, 0.9);
          this.setPieceColor(listIconNode[k], 2);
        } else if (this.listLocationPiece.valueRowAndColumn == 5) {
          listIconNode[k].setScale(0.8, 0.8, 0.8);
          this.setPieceColor(listIconNode[k], 3);
        }
      }
    }
  }
  setMapPopup1(indexMap: number) {
    let imagesPath = DT_path.SPRITE_MAP + "map" + indexMap.toString() + "/spriteFrame";
    let spriteFrame_map = VDScreenManager.instance.assetBundle.get(imagesPath, SpriteFrame);
    this.BG_popup1.spriteFrame = spriteFrame_map;
  }

  setPieceColor(pieceNode: Node, indexMap: number) {
    let imagesPath = DT_path.TREASURE_COLOR + "piece" + indexMap.toString() + "/spriteFrame";
    let spriteFrame_piece = VDScreenManager.instance.assetBundle.get(imagesPath, SpriteFrame);
    let pieceControl = pieceNode.getComponent("pieceControler") as pieceControler;
    pieceControl.setSpriteFramePiece(spriteFrame_piece);
  }

  showPoint_loseGame(point: number) {
    this.showPointLose.string = "-" + point.toString();
    tween(this.showPointLose.node)
      .to(0.2, { scale: new Vec3(1.5, 1.5, 1.5) })
      .to(0.2, { scale: new Vec3(1, 1, 1) })
      .union()
      .repeat(5)
      .call(() => {
        this.showPointLose.string = "";
        this.showPointLose.node.setScale(1, 1, 1);
      })
      .start();
  }
  setMapPopup(indexMap) {
    let imagesPath = DT_path.SPRITE_MAP + "map" + indexMap.toString() + "/spriteFrame";
    let spriteFrame_map = VDScreenManager.instance.assetBundle.get(imagesPath, SpriteFrame);
    this.BG_popup1.spriteFrame = spriteFrame_map;
  }
}
