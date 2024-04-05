

export type PLAYER_NAME_DATA = {
  id: number;
  playerName: string;
};

export type IP_GET_TREASURE_RANDOM_LIST = {
  id: number;
  TreasureIndex: number;
};

export type IP_SEND_INDEX_ONCLICK_PIECE = {
  id: number;
  pieceIndex: number;
  indexInArr: number;
};

export type IP_GET_LIST_TREASURE_MAP = {
  id: number;
  treasureCurrent: number;
  indexMapCurrent: number;
  valueRowAndColumn: number;
};

export type IP_GET_RECORD_PLAYERS = {
  id: number;
};
export type IP_SET_LIST_MONEY_WIN_LOSE_NEW_ROUND = {
  id: number;
  mapCurrent: number;
};

