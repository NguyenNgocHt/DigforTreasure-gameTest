import { pieceControler } from "./../pieceControler";
import { instantiate } from "cc";
import { Prefab } from "cc";
import { _decorator, Component, Node } from "cc";
import { dm_Director } from "../../common/dm_Director";
const { ccclass, property } = _decorator;

@ccclass("poolControler")
export class poolControler extends Component {
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
    console.log("bắt được pool");
    console.log(this.poolPieceList);
  }
  public initPieceTreasure() {
    for (let i = 0; i < this.numberPool; i++) {
      console.log("jhasfdasef", i);
      let iconNodePiece: Node | null = null;
      console.log("prefab", this.icon_prefab);
      if (this.icon_prefab) {
        console.log("nhay vào dây 1");
        iconNodePiece = instantiate(this.icon_prefab);
        if (iconNodePiece) {
          console.log("nhay vào dây 2");
          this.pool_piece_treasure_group.addChild(iconNodePiece);
          iconNodePiece.setPosition(0, 0);
          iconNodePiece.active = false;
          this.poolPieceList.push(iconNodePiece);
        }
      }
    }

    console.log(this.poolPieceList);
    console.log(this.pool_piece_treasure_group);
  }

  public GetIconNodePiece() {
    if (this.poolPieceList.length > 0) {
      let iconMode = this.poolPieceList.pop();
      //   this.ResetIconBgNodeToOrigin(iconBgtetrisNode);
      return iconMode;
    } else {
      this.initPieceTreasure();
      let iconNode = this.poolPieceList.pop();
      //   this.ResetIconBgNodeToOrigin(iconBgtetrisNode);
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
