import { dragonBones } from "cc";
import { mock_treasureOpen } from "./../../../../vd-mock/mock_config";
export type DT_INIT_TREASURE_MODEL = {
  id: number;
  listTreasureStatus: number[];
};
export type DT_PLAYER_INFO_MODEL = {
  id: number;
  userName: string;
  avatarID: number;
  money: number;
};
export type DT_listRandomLocationTreasure_dataModel = {
  id: number;
  listRandomLocationTreasure: number[];
};
export type DT_sendResultOnclickingThePiece_dataModel = {
  id: number;
  indexInArr: number;
  countOnClick: number;
  resultOnClick: boolean;
  money: number;
};
