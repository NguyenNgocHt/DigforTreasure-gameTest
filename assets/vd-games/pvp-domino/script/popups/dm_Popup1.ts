import { _decorator, Node, Vec3, tween } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { dm_Director } from "../common/dm_Director";
import { DT_listRandomLocationTreasure_dataModel, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { pieceControler } from "../controler/pieceControler";
import { DigTreasureControler } from "../common/DigTreasureControler";
import { Label } from "cc";
import { DT_Global } from "../common/DT_Global";
const { ccclass, property } = _decorator;

@ccclass("dm_Popup1")
export class dm_Popup1 extends VDBasePopup {
  @property(Node)
  PosStart: Node = null;
  @property(Node)
  pieceParent: Node = null;
  @property(Label)
  showPointLose: Label = null;
  finishedCallback: any = null;
  listIconNode: Node[] = [];
  listLocationPiece: DT_listRandomLocationTreasure_dataModel = null;
  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  rowNumber: number = 3;
  columnNumber: number = 3;
  distance_2_icon: number = 150;
  start() {
    dm_Director.instance.dm_popup_1 = this;
  }
  showLogConect() {
    console.log("Da ket noi ok");
  }
  initTableTreasure(data: DT_listRandomLocationTreasure_dataModel, listNode: Node[]) {
    this.listIconNode = [];
    let listIconNode = listNode;
    this.listIconNode = listIconNode;
    console.log(data);
    this.listLocationPiece = {
      id: data.id,
      listRandomLocationTreasure: data.listRandomLocationTreasure,
    };
    let posStart = this.PosStart.getWorldPosition();
    let listLocation = this.listLocationPiece.listRandomLocationTreasure;
    console.log("list location", listLocation, this.listLocationPiece);
    for (let i = 0; i < this.rowNumber; i++) {
      for (let j = 0; j < this.columnNumber; j++) {
        let k = i * this.columnNumber + j;
        let pieceControler = listIconNode[k].getComponent("pieceControler") as pieceControler;
        pieceControler.setPiceIndex(listLocation[k], k);
        this.pieceParent.addChild(listIconNode[k]);
        listIconNode[k].setWorldPosition(posStart.x + j * this.distance_2_icon, posStart.y - i * this.distance_2_icon, 0);
      }
    }
  }
  showResultOnClickToPiece(data: DT_sendResultOnclickingThePiece_dataModel) {
    console.log(data);
    this.resultOnclickPiece = {
      id: data.id,
      indexInArr: data.indexInArr,
      countOnClick: data.countOnClick,
      resultOnClick: data.resultOnClick,
      money: data.money,
    };
    let resultOnclickPiece = this.resultOnclickPiece.resultOnClick;
    if (resultOnclickPiece) {
      this.scheduleOnce(function () {
        console.log("huy node sau 8 s");
        this.pushPoolPieceGroup();
        this.onClickBtnClose();
      }, 8);
      for (let i = 0; i < this.listIconNode.length; i++) {
        let pieceControler = this.listIconNode[i].getComponent("pieceControler") as pieceControler;
        if (i == this.resultOnclickPiece.indexInArr) {
          pieceControler.showEffectTreasureOpen(this.resultOnclickPiece.money);
        } else {
          pieceControler.LockOnClick_on_off(true);
          this.scheduleOnce(function () {
            pieceControler.showEffectBoom();
          }, DT_Global.instance.RandomNumber(200, 300) / 100);
        }
      }
    } else {
      if (this.resultOnclickPiece.countOnClick === 3) {
        this.scheduleOnce(function () {
          console.log("huy node sau 7 s");
          this.pushPoolPieceGroup();
          this.onClickBtnClose();
        }, 6);
        this.scheduleOnce(function () {
          this.show_PointLose(data.money);
        }, 2);
        for (let i = 0; i < this.listIconNode.length; i++) {
          let pieceControler = this.listIconNode[i].getComponent("pieceControler") as pieceControler;
          if (i == this.resultOnclickPiece.indexInArr) {
            pieceControler.showEffectBoom();
          } else {
            pieceControler.LockOnClick_on_off(true);
            this.scheduleOnce(function () {
              pieceControler.showEffectBoom();
            }, DT_Global.instance.RandomNumber(10, 300) / 100);
          }
        }
      } else {
        for (let i = 0; i < this.listIconNode.length; i++) {
          if (i == this.resultOnclickPiece.indexInArr) {
            let pieceControler = this.listIconNode[i].getComponent("pieceControler") as pieceControler;
            pieceControler.showEffectBoom();
          }
        }
      }
    }
  }
  pushPoolPieceGroup() {
    for (let i = 0; i < this.listIconNode.length; i++) {
      dm_Director.instance.pushPoolPiece(this.listIconNode[i]);
    }
    this.pieceParent.removeAllChildren();
  }
  onClickBtnClose() {
    this.hide();
    this.finishedCallback && this.finishedCallback();
  }
  show_PointLose(coin: number) {
    this.showPointLose.string = "-" + coin.toString();
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
}
