import { Sprite } from "cc";
import { spriteAssembler } from "cc";
import { _decorator, Component, Node, Label } from "cc";
import { DT_Global } from "../../common/DT_Global";
const { ccclass, property } = _decorator;

@ccclass("dm_Item_TableView")
export class dm_Item_TableView extends Component {
  @property(Label)
  lbItem: Label = null!;

  @property(Label)
  lbContent_1: Label = null!;
  @property(Label)
  lbContent_2: Label = null!;
  @property(Sprite)
  avatarUser: Sprite = null;
  @property(Node)
  playerMain: Node = null;
  @property(Node)
  playerOther: Node = null;
  @property(Node)
  top1_BG: Node = null;
  @property(Node)
  top2_BG: Node = null;
  @property(Node)
  top3_BG: Node = null;
  setData(itemData: any) {
    console.log(itemData);
    this.top1_BG.active = false;
    this.top2_BG.active = false;
    this.top3_BG.active = false;
    this.playerOther.active = false;
    this.playerMain.active = false;
    this.lbItem && (this.lbItem.string = itemData.id);
    this.lbContent_1 && (this.lbContent_1.string = itemData.content1);
    this.lbContent_2 && (this.lbContent_2.string = itemData.content2);
    this.avatarUser && (this.avatarUser.spriteFrame = DT_Global.instance.getAvatarByID(itemData.avatarID));
    if (itemData.isMain) {
      this.playerMain.active = true;
    } else {
      this.playerOther.active = true;
    }

    if (itemData.isTop1) {
      console.log("set top 1");
      this.top1_BG.active = true;
    } else {
      this.playerOther.active = true;
    }

    if (itemData.isTop2) {
      console.log("set top 2");
      this.top2_BG.active = true;
    } else {
      this.playerOther.active = true;
    }

    if (itemData.isTop3) {
      console.log("set top 3");
      this.top3_BG.active = true;
    } else {
      this.playerOther.active = true;
    }
  }
}
