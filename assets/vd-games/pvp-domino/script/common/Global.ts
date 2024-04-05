import { _decorator, SpriteAtlas } from "cc";
import { SpriteFrame } from "cc";
import { DT_path } from "./Define";
import VDScreenManager from "../../../../vd-framework/ui/VDScreenManager";
const { ccclass, property } = _decorator;

@ccclass("Global")
export class Global {
  private static _instance: Global = null!;

  public static get instance(): Global {
    if (this._instance == null) {
      this._instance = new Global();
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
  moneyWinOrigin: number = 1000;
  moneyLoseOrigin: number = 800;
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
