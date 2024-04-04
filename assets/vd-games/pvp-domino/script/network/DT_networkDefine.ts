export const DT_GAME_STATUS_EVENT = {
  SEVER_TO_CLIENT: "send data sever to client",
  CLIENT_TO_SEVER: "send data client to sever",
  DIRECTOR_TO_SEND_DATA_SEVER: "director to send data sever",
  //send data to director
  INIT_TREASURE_TO_DIRECTOR: "init treasure to director",
  INIT_PLAYER_INFO: "init player info",
  GET_LIST_RANDOM_LOCATION_TREASURE: "get list random location treasure",
  RESULT_ONCLICK_PIECE: "result onClick piece",
  RECORD_PLAYERS_DATA: "record player data",
  //send data to game play ctr
  PLAYER_INFO: "player info",
  TREASURE_DATA: "treasure data",
  RESULT_GAME_DATA: "result game data",
  UPDATE_COIN_WIN_LOSE_GAME: "coin win lose game",
  SHOW_MESENGER: "show mesenger",
  GET_THE_NEXT_TREASURE_ON_THE_MAP: "get  next treasure on the map",
  GET_RECORD_PLAYERS: "get record player",
  GET_LIST_RANDOM_TREASURE: "get list random treasure",
  SET_LIST_MONEY_WIN_LOSE: "set list money win lose",
  SET_INDEX_MAP: "set index map",
  GET_PLAYER_INFO_TO_HOME: "get player info to home",
  INIT_RECORD_PLAYERS: "init record players",
  LIST_RANDOM_LOCATION_TREASURE: "list random location treasure",
  RESULT_ONCLICK_TREASURE: "result onclick treasure",
  // key work send mesenger in dm_poup1
  SEND_TO_POPUP1_CTR_LIST_RANDOM_LOCATION_TREASURE: "random location treasure-send to popup1",
  REGISTER_EVENT_POPUP_TREASURE: "register event popup treasure",
  SHOW_EFFECT_TREASURE_OPEN: "show effect treasure open",
  AUDIO_WINGAME: "audio win game",
  AUDIO_BOOM_SOUND: "audio boom sound",
  PUSH_ICON_NODE_TO_POOL_GROUP: "push icon node to pool group",
  HIDE_POPUP: "hide popup",
  UNLOCKER_STATUS: "unlocker status",
  SHOW_EFFECT_BOOM: "show effect boom",
  SHOW_POINT_LOSE: "show point lose game",
};
export let DT_commandID_OP = {
  DT_INIT_TREASURE_START_GAME: 1000,
  DT_USER_INFO: 1001,
  DT_LIST_RANDOM_LOCATION_TREASURE: 1002,
  DT_RESULT_ONCLICK_TREASURE: 1003,
  DT_RECORD_PLAYERS: 1004,
};
export let DT_commanID_IP = {
  GET_LIST_TREASURE: 1999,
  PLAYER_NAME_ID: 2000,
  GET_TREASURE_RAMDOM_INDEX: 2001,
  SEND_INDEX_ONCLICK_PIECE: 2002,
  GET_RECORD_PLAYERS: 2003,
  SET_LIST_MONEY_WIN_LOSE_NEW_ROUND: 2004,
};
