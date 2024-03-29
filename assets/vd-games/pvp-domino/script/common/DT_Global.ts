import { _decorator, Component, Node, SpriteAtlas } from "cc";
import { DT_PLAYER_INFO_MODEL } from "../model/DT_outputDataModel";
import { SpriteFrame } from "cc";
import { DT_path } from "./DT_define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
const { ccclass, property } = _decorator;

@ccclass("DT_Global")
export class DT_Global {
  private static _instance: DT_Global = null!;

  public static get instance(): DT_Global {
    if (this._instance == null) {
      this._instance = new DT_Global();
    }

    return this._instance;
  }
  FIRST_NAMES = [
    "John",
    "Emma",
    "Michael",
    "Sophia",
    "William",
    "Olivia",
    "James",
    "Ava",
    "Alexander",
    "Isabella",
    "Benjamin",
    "Mia",
    "Daniel",
    "Charlotte",
    "Matthew",
    "Amelia",
    "Henry",
    "Harper",
    "Andrew",
    "Evelyn",
    "Joseph",
    "Abigail",
    "David",
    "Emily",
    "Samuel",
    "Elizabeth",
    "Ethan",
    "Sofia",
    "Christopher",
    "Avery",
    "Gabriel",
    "Ella",
    "Jackson",
    "Madison",
    "Sebastian",
    "Scarlett",
    "Logan",
    "Grace",
    "Lucas",
    "Chloe",
    "Jack",
    "Lily",
    "Ryan",
    "Addison",
    "Nathan",
    "Natalie",
    "Carter",
    "Hannah",
    "Luke",
    "Aubrey",
  ];
  getFirstName(): string[] {
    return this.FIRST_NAMES;
  }
  RandomNumber(minNumber: number, maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber) + minNumber;
  }
  InitListRandom(randomNumber: number, ListIndex: number): number[] {
    let listRandom: number[];
    listRandom = [];
    for (let i = 0; i < ListIndex; i++) {
      if (i == randomNumber) {
        listRandom.push(1);
      } else {
        listRandom.push(0);
      }
    }
    return listRandom;
  }
  formatNumberWithCommas(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getAvatarByID(id: number): SpriteFrame {
    let avatarName = "avatar" + id.toString();
    let avatarGroupPath = DT_path.AVATAR_TEXTURE_PACKER;
    let texturePacker = VDScreenManager.instance.assetBundle.get(avatarGroupPath, SpriteAtlas);
    let spriteFrameAvatar = texturePacker.getSpriteFrame(avatarName);
    return spriteFrameAvatar;
  }
}
