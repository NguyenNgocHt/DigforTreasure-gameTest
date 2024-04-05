import { VDGameConfig } from "../../../../vd-framework/common/VDGameConfig";

export type dm_ConfigType = VDGameConfig & {
  win_coin: number;
};

export const dm_Config: dm_ConfigType = {
  GAME_ID: "1000",
  GAME_NAME: "domino",
  versionGame: "1.0.0",
  isShowFPS: true,
  isUnitTest: true,
  //------ extends
  win_coin: 1000,
};
export type DT_listTreasureMap_LocalStorage = {
  indexTreasureCurrentOpen: number;
  indexMapCurrent: number;
  valueRowAndColumn: number;
};
export type DT_playersInfo = {
  userName: string;
  avatarID: number;
  coin: number;
};
