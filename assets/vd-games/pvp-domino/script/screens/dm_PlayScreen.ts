import { Prefab } from "cc";
import { _decorator, Component, Node, log, sp, instantiate } from "cc";
import VDBaseScreen from "../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
import { dm_Director } from "../common/dm_Director";
import { Skeleton } from "cc";
const { ccclass, property } = _decorator;

@ccclass("dm_PlayScreen")
export class dm_PlayScreen extends VDBaseScreen {
  @property(Node)
  SkeletonAnim: Node = null;
  private spine: sp.Skeleton = null;
  onLoad() {
    this.playDefautSkin();
  }
  onClickBtnNext() {
    log(`onClickBtnNext`);

    let play_screen = VDScreenManager.instance.assetBundle.get("res/prefabs/screen/play_screen_2", Prefab)!;
    VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => {}, true);
  }
  playDefautSkin() {
    console.log("set play defautSkin");
    console.log("nhay vào đây");
      let skinname = ["avatar", "mouth/avatar_0_0", "face_decor/avatar_0_0", "eyebrow/avatar_0_0",
        "hair/avatar_0_2", "eye/avatar_0_5", "pant/avatar_0_7", "shoes/avatar_0_11", "shirt/avatar_0_14"];
    console.log("skin name", skinname);
    for (let i = 0; i < 9; i++) {
      console.log("set skinname", skinname[i]);
      let newSkeleton = instantiate(this.SkeletonAnim);
      newSkeleton.parent = this.node;
      let newSkeletonComp = newSkeleton.getComponent("sp.Skeleton") as sp.Skeleton;
      if (newSkeletonComp) {
        newSkeletonComp.setSkin(skinname[i]);
      }
      console.log("new skeleton", newSkeletonComp);
    }
  }
}
