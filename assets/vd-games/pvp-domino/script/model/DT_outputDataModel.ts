import { DT_playersInfo } from "../common/dm_Config";
export type DT_INIT_TREASURE_MODEL = {
  id: number;
  listTreasureStatus: number[];
  treasureCurrentNotOpen: number;
  mapCurrent: number;
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
  indexMapCurrent: number;
  valueRowAndColumn: number;
};
export type DT_sendResultOnclickingThePiece_dataModel = {
  id: number;
  indexInArr: number;
  countOnClick: number;
  resultOnClick: boolean;
  money: number;
};
export type DT_recordPlayersList_dataModel = {
  id: number;
  ListPlayesInfo: DT_playersInfo[];
};
