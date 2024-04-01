import { pieceControler } from "./../pieceControler";
import { instantiate } from "cc";
import { Prefab } from "cc";
import { _decorator, Component, Node } from "cc";
import { dm_Director } from "../../common/dm_Director";
import { I_poolControler } from "../../common/dt_interfaceDefine";
const { ccclass, property } = _decorator;

@ccclass("poolControler")
export class poolControler extends Component implements I_poolControler {
  @property(Prefab)
  private icon_prefab: Prefab = null;
  @property(Node)
  pool_piece_treasure_group: Node = null;
  private poolPieceList: Node[];
  numberPool: number = 50;

  onLoad() {
    this.icon_prefab = this.icon_prefab || this.icon_prefab;
    this.poolPieceList = [];
    this.initPool();
    dm_Director.instance.pool_controler = this;
  }
  private static _instance: poolControler = null!;
  public static get instance(): poolControler {
    if (this._instance == null) {
      this._instance = new poolControler();
    }

    return this._instance;
  }
  public initPool() {
    this.initPieceTreasure();
  }
  showConectFromDirector() {
    console.log(this.poolPieceList);
  }
  public initPieceTreasure() {
    for (let i = 0; i < this.numberPool; i++) {
      let iconNodePiece: Node | null = null;
      if (this.icon_prefab) {
        iconNodePiece = instantiate(this.icon_prefab);
        if (iconNodePiece) {
          this.pool_piece_treasure_group.addChild(iconNodePiece);
          iconNodePiece.setPosition(0, 0);
          iconNodePiece.active = false;
          this.poolPieceList.push(iconNodePiece);
        }
      }
    }
  }

  public GetIconNodePiece() {
    if (this.poolPieceList.length > 0) {
      let iconMode = this.poolPieceList.pop();
      return iconMode;
    } else {
      this.initPieceTreasure();
      let iconNode = this.poolPieceList.pop();
      return iconNode;
    }
  }

  public PushIconPiece(iconNode: Node) {
    if (iconNode.parent) {
      iconNode.removeFromParent();
    }
    this.setIconPieceToValueOrigin(iconNode);
    this.poolPieceList.push(iconNode);
    this.pool_piece_treasure_group.addChild(iconNode);
    iconNode.setPosition(0, 0);
    iconNode.active = false;
  }
  setIconPieceToValueOrigin(iconNode) {
    let pieceControler = iconNode.getComponent("pieceControler") as pieceControler;
    pieceControler.on_off_imageNode(true);
    pieceControler.setPiceIndex(-1, -1);
    pieceControler.resetAllValueToOrigin();
  }
  update(deltaTime: number) {}
}
