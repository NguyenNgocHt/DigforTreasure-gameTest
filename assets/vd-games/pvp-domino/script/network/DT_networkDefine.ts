export const DT_GAME_STATUS_EVENT = {
  SEVER_TO_CLIENT: "send data sever to client",
  CLIENT_TO_SEVER: "send data client to sever",
  //send data to director
  INIT_TREASURE_TO_DIRECTOR: "init treasure to director",
  INIT_PLAYER_INFO: "init player info",
  GET_LIST_RANDOM_LOCATION_TREASURE: "get list random location treasure",
  RESULT_ONCLICK_PIECE: "result onClick piece",
};
export let DT_commandID_OP = {
  DT_INIT_TREASURE_START_GAME: 1000,
  DT_USER_INFO: 1001,
  DT_LIST_RANDOM_LOCATION_TREASURE: 1002,
  DT_RESULT_ONCLICK_TREASURE: 1003,
};
export let DT_commanID_IP = {
  GET_LIST_TREASURE: 1999,
  PLAYER_NAME_ID: 2000,
  GET_TREASURE_RAMDOM_INDEX: 2001,
  SEND_INDEX_ONCLICK_PIECE: 2002,
};
