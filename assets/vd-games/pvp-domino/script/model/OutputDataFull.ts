import { DT_playersInfo } from "../common/Config";

export type DT_initTreaDataFull = {
  ID: number;
  L: number[];
  TC: number; // treasure current not open
  M: number; //map current
};

export type DT_playerInfoDataFull = {
  ID: number;
  N: string;
  A_ID: number;
  M: number;
};

export type DT_listRandomLocationTreasure_OP = {
  ID: number;
  LT: number[];
  MR: number;
  RC: number; // value row and column
};

export type DT_sendResultOnclickingThePiece = {
  ID: number;
  I: number; // index piece in arr;
  C: number; //count onclick the piece
  R_OnClick: boolean; //result dig treasure
  M: number; //money in treasure
};

export type DT_sendListTreasureMap = {
  ID: number;
  L: number[];
};

export type DT_recordPlayersList = {
  ID: number;
  L: DT_playersInfo[];
};
