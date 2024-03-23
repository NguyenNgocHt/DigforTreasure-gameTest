import { IP_SEND_INDEX_ONCLICK_PIECE } from "./../model/DT_inputDataModel";
import { _decorator, Component, Node } from "cc";
import { dm_Director } from "../common/dm_Director";
import { DT_commanID_IP } from "../network/DT_networkDefine";
import { Sprite } from "cc";
import { Tween } from "cc";
import { tween } from "cc";
import { DT_path } from "../common/DT_define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { SpriteAtlas } from "cc";
import { Label } from "cc";
import { Vec2 } from "cc";
import { Vec3 } from "cc";
import { SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("pieceControler")
export class pieceControler extends Component {
  @property(Node)
  bonusNode: Node = null;
  @property(Node)
  imageNode: Node = null;
  @property(Label)
  pointBonus: Label = null;
  private pieceIndex: number = -1;
  private indexInArr: number = -1;
  IP_sendIndexOnclickPiece: IP_SEND_INDEX_ONCLICK_PIECE = null;
  isLockOnclick: boolean = false;
  originIndex: number = 0;
  start() {
    this.getIndexOrigin();
  }
  getIndexOrigin() {
    this.originIndex = this.node.getSiblingIndex();
  }
  public setPiceIndex(pieceIndex: number, indexInArr: number) {
    this.pieceIndex = pieceIndex;
    this.indexInArr = indexInArr;
  }
  LockOnClick_on_off(status: boolean) {
    this.isLockOnclick = status;
  }
  on_off_imageNode(status: boolean) {
    this.imageNode.active = status;
  }
  resetAllValueToOrigin() {
    this.originIndex = 0;
    this.isLockOnclick = false;
    this.pointBonus.string = "";
    this.pointBonus.node.setScale(1, 1, 1);
  }
  setSpriteFramePiece(SpriteFrame: SpriteFrame) {
    this.imageNode.getComponent(Sprite).spriteFrame = SpriteFrame;
  }
  onClickToPiece() {
    if (!this.isLockOnclick) {
      this.IP_sendIndexOnclickPiece = {
        id: DT_commanID_IP.SEND_INDEX_ONCLICK_PIECE,
        pieceIndex: this.pieceIndex,
        indexInArr: this.indexInArr,
      };
      console.log("IP_sendIndexOnclickPiece", this.IP_sendIndexOnclickPiece);
      dm_Director.instance.sendDataToSever(this.IP_sendIndexOnclickPiece);
    }
  }
  public showEffectBoom() {
    let nodeBoom = new Node();
    this.node.addChild(nodeBoom);
    this.node.setSiblingIndex(999);
    nodeBoom.addComponent(Sprite);
    nodeBoom.setPosition(0, 0);
    nodeBoom.setScale(1.5, 1.5);
    let index = 3;
    Tween.stopAllByTarget(nodeBoom);
    tween(nodeBoom)
      .delay(0.1)
      .call(() => {
        let numberString = "";
        if (index < 10) {
          numberString = "0000" + index.toString();
        } else if (index >= 10 && index < 100) {
          numberString = "000" + index.toString();
        }
        let urlImage = "maubinh_rocketbomb__" + numberString;
        let boomPath = DT_path.BOOM_TEXTURE_PACKER;
        let boom_atlas = VDScreenManager.instance.assetBundle.get(boomPath, SpriteAtlas);
        if (boom_atlas) {
          let boomSprite = nodeBoom.getComponent(Sprite);
          boomSprite.spriteFrame = boom_atlas.getSpriteFrame(urlImage);
        }

        index += 1;
        if (index == 16) {
          this.imageNode.active = false;
        }
        if (index == 23) {
          console.log("nhay vao day");
          nodeBoom.active = false;

          index = 3;
          this.node.setSiblingIndex(this.originIndex);
          this.scheduleOnce(function () {
            nodeBoom.destroy();
          }, 7);
        }
      })
      .union()
      .repeat(20)
      .start();
  }
  public showEffectTreasureOpen(pointBonus: number) {
    let nodeTreasure = new Node();
    this.node.addChild(nodeTreasure);
    this.node.setSiblingIndex(999);
    nodeTreasure.addComponent(Sprite);
    nodeTreasure.setPosition(0, 0);
    nodeTreasure.setScale(2, 2);
    let index = 1;
    Tween.stopAllByTarget(nodeTreasure);
    tween(nodeTreasure)
      .delay(0.4)
      .call(() => {
        let urlImage = "treasure_" + index.toString();
        let treasurePath = DT_path.TREASURE_TEXTURE_PACKER;
        let treasure_atlas = VDScreenManager.instance.assetBundle.get(treasurePath, SpriteAtlas);
        if (treasure_atlas) {
          let treasureSprite = nodeTreasure.getComponent(Sprite);
          treasureSprite.spriteFrame = treasure_atlas.getSpriteFrame(urlImage);
        }
        index += 1;
        if (index == 6) {
          this.imageNode.active = false;
        }
        if (index == 7) {
          nodeTreasure.active = false;
          index = 1;
          this.bonusNode.active = true;
          this.pointBonus.string = "+" + pointBonus.toString();
          tween(this.pointBonus.node)
            .to(0.2, { scale: new Vec3(2, 2, 2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeat(10)
            .start();
          this.scheduleOnce(function () {
            this.node.setSiblingIndex(this.originIndex);
            this.bonusNode.active = false;
            this.pointBonus.string = "";
            nodeTreasure.destroy();
          }, 5);
        }
      })
      .union()
      .repeat(7)
      .start();
  }
}
