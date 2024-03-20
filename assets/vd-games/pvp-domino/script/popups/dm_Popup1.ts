import { dm_TableView } from "./table_view/dm_TableView";
import { StartScene } from "./../../../../vd-boot/StartScene";
import { _decorator, Component, Node } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { dm_Director } from "../common/dm_Director";
import { DT_listRandomLocationTreasure_dataModel, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { poolControler } from "../controler/pool/poolControler";
import { pieceControler } from "../controler/pieceControler";
import { DigTreasureControler } from "../common/DigTreasureControler";
const { ccclass, property } = _decorator;

@ccclass("dm_Popup1")
export class dm_Popup1 extends VDBasePopup {
  @property(Node)
  PosStart: Node = null;
  @property(Node)
  pieceParent: Node = null;
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
        console.log("gia trị của K", k);
        let pieceControler = listIconNode[k].getComponent("pieceControler") as pieceControler;
        pieceControler.setPiceIndex(listLocation[k], k);
        this.pieceParent.addChild(listIconNode[k]);
        console.log(posStart.x + j * this.distance_2_icon, posStart.y - i * this.distance_2_icon);
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
      for (let i = 0; i < this.listIconNode.length; i++) {
        let pieceControler = this.listIconNode[i].getComponent("pieceControler") as pieceControler;
        if (i == this.resultOnclickPiece.indexInArr) {
          pieceControler.showEffectTreasureOpen();
        } else {
          this.scheduleOnce(function () {
            pieceControler.showEffectBoom();
          }, DigTreasureControler.instance.RandomNumber(200, 300) / 100);
        }
      }
    } else {
      if (this.resultOnclickPiece.countOnClick === 3) {
        for (let i = 0; i < this.listIconNode.length; i++) {
          let pieceControler = this.listIconNode[i].getComponent("pieceControler") as pieceControler;
          if (i == this.resultOnclickPiece.indexInArr) {
            pieceControler.showEffectBoom();
          } else {
            this.scheduleOnce(function () {
              pieceControler.showEffectBoom();
            }, DigTreasureControler.instance.RandomNumber(200, 300) / 100);
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
  onClickBtnClose() {
    this.hide();
    this.finishedCallback && this.finishedCallback();
  }
}
