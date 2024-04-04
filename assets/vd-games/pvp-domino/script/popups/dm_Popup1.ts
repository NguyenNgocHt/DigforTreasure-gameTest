import { audioControler } from "./../controler/audioControler";
import { _decorator, Node, Vec3, tween, SpriteFrame, Sprite } from "cc";
import VDBasePopup from "../../../../vd-framework/ui/VDBasePopup";
import { dm_Director } from "../common/dm_Director";
import { DT_listRandomLocationTreasure_dataModel, DT_sendResultOnclickingThePiece_dataModel } from "../model/DT_outputDataModel";
import { pieceControler } from "../controler/pieceControler";
import { Label } from "cc";
import { DT_Global } from "../common/DT_Global";
import { DT_path } from "../common/DT_define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { I_director, I_popup1, I_popup1_view } from "../common/dt_interfaceDefine";
import { VDEventListener } from "../../../../vd-framework/common/VDEventListener";
import { DT_GAME_STATUS_EVENT } from "../network/DT_networkDefine";
import { popup1_view } from "./popup1/popup1_view";
const { ccclass, property } = _decorator;

@ccclass("dm_Popup1")
export class dm_Popup1 extends VDBasePopup implements I_popup1 {
  @property(audioControler)
  audioPlay: audioControler = null;
  @property(Node)
  PosStart: Node = null;
  @property(Node)
  pieceParent: Node = null;
  @property(Label)
  showPointLose: Label = null;
  @property(Sprite)
  BG_popup1: Sprite = null;
  @property(popup1_view)
  popupView: popup1_view = null;
  finishedCallback: any = null;
  listIconNode: Node[] = [];
  listLocationPiece: DT_listRandomLocationTreasure_dataModel = null;
  resultOnclickPiece: DT_sendResultOnclickingThePiece_dataModel = null;
  rowNumber: number = 3;
  columnNumber: number = 3;
  distance_2_icon: number = 150;
  countNumberUpdate: number = 0;

  private _i_director: I_director = null;
  private _iPopup1View: I_popup1_view = null;
  start() {
    dm_Director.instance.dm_popup_1 = this;
    // this.setVarInterface(dm_Director.instance, this.popupView);
  }
  setup_newPopup() {
    this.setVarInterface(dm_Director.instance, this.popupView);
    this.registerEvent();
  }
  registerEvent() {
    VDEventListener.on(DT_GAME_STATUS_EVENT.SEND_TO_POPUP1_CTR_LIST_RANDOM_LOCATION_TREASURE, this.init_tableTreasure.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.PUSH_ICON_NODE_TO_POOL_GROUP, this.pushPoolPieceGroup.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.HIDE_POPUP, this.onClickBtnClose.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SHOW_EFFECT_TREASURE_OPEN, this.showEffect_treasureOpen.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.AUDIO_WINGAME, this.audioPlay_winGame.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, this.setUnlockerStatus.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, this.showEffectBoom.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, this.audioPlay_boom.bind(this));
    VDEventListener.on(DT_GAME_STATUS_EVENT.SHOW_POINT_LOSE, this.show_PointLose.bind(this));
  }
  offEvent() {
    VDEventListener.off(DT_GAME_STATUS_EVENT.SEND_TO_POPUP1_CTR_LIST_RANDOM_LOCATION_TREASURE, this.init_tableTreasure.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.PUSH_ICON_NODE_TO_POOL_GROUP, this.pushPoolPieceGroup.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.HIDE_POPUP, this.onClickBtnClose.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SHOW_EFFECT_TREASURE_OPEN, this.showEffect_treasureOpen.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.AUDIO_WINGAME, this.audioPlay_winGame.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.UNLOCKER_STATUS, this.setUnlockerStatus.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SHOW_EFFECT_BOOM, this.showEffectBoom.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.AUDIO_BOOM_SOUND, this.audioPlay_boom.bind(this));
    VDEventListener.off(DT_GAME_STATUS_EVENT.SHOW_POINT_LOSE, this.show_PointLose.bind(this));
  }
  init_tableTreasure(data, listNode) {
    if (this.node != null) {
      this.listIconNode = [];
      let listIconNode = listNode;
      this.listIconNode = listIconNode;
      this._iPopup1View.initTableTreasure(data, listIconNode);
    }
  }

  setVarInterface(director: I_director, popupView: I_popup1_view) {
    if (this.node != null) {
      this._i_director = director;
      this._iPopup1View = popupView;
    }
  }

  pushPoolPieceGroup() {
    if (this.node != null) {
      for (let i = 0; i < this.listIconNode.length; i++) {
        this._i_director.pushPoolPiece(this.listIconNode[i]);
      }
      this.pieceParent.removeAllChildren();
    }
  }

  onClickBtnClose() {
    if (this.node != null) {
      this.hide();
      this.finishedCallback && this.finishedCallback();
    }
  }

  show_PointLose(coin: number) {
    if (this.node != null) {
      this._iPopup1View.showPoint_loseGame(coin);
    }
  }
  showEffect_treasureOpen(money, pieceIndex) {
    if (this.node != null) {
      let pieceControler = this.listIconNode[pieceIndex].getComponent("pieceControler") as pieceControler;
      pieceControler.showEffectTreasureOpen(money);
    }
  }
  setMapPopup1(indexMap: number) {
    if (this.node != null) {
      this._iPopup1View.setMapPopup(indexMap);
    }
  }

  onClickButton_sound(): void {
    if (this.node != null) {
      this.audioPlay.onclickSound();
    }
  }
  audioPlay_winGame() {
    if (this.node != null) {
      this.audioPlay.winSound();
    }
  }
  setUnlockerStatus(pieceIndex) {
    if (this.node != null) {
      let pieceControler = this.listIconNode[pieceIndex].getComponent("pieceControler") as pieceControler;
      pieceControler.setToLockTreasureDiggingStatus(true);
    }
  }
  showEffectBoom(pieceIndex) {
    if (this.node != null) {
      let pieceControler = this.listIconNode[pieceIndex].getComponent("pieceControler") as pieceControler;
      pieceControler.showEffectBoom();
    }
  }
  audioPlay_boom(pieceIndex) {
    if (this.node != null) {
      this.audioPlay.onClickEffectBoom();
    }
  }
}
