import { Global } from "./../../common/Global";
import { math } from "cc";
import { _decorator, Component, Node } from "cc";
import VDBasePopup from "../../../../../vd-framework/ui/VDBasePopup";
import VDTableView, { VDTableViewDataSource } from "../../../../../vd-framework/ui/VDTableView";
import { Item_TableView } from "./Item_TableView";
import { DT_playersInfo } from "../../common/Config";
import { Director } from "../../common/Director";
const { ccclass, property } = _decorator;

@ccclass("TableView")
export class TableView extends VDBasePopup implements VDTableViewDataSource {
  @property(VDTableView)
  protected tableView: VDTableView = null!;

  protected _listItems: any[] = [];
  private numItems: number = 51;
  onLoad() {
    Director.instance.tableView = this;
  }
  numberOfCellsInTableView(tableView: VDTableView): number {
    return this._listItems.length;
  }
  tableCellAtIndex(tableView: VDTableView, idx: number): Node {
    let cell = tableView.dequeueCell();
    let comp = cell?.getComponent(Item_TableView);
    comp?.setData(this._listItems[idx]);
    return cell;
  }

  onEnable() {
    this.tableView.dataSource = this;
  }
  initListData(dataRecordPlayers: DT_playersInfo[]) {
    console.log(dataRecordPlayers);
    this._listItems = [];

    for (let i = 0; i < this.numItems; i++) {
      let isMain: boolean;
      let _isTop1: boolean;
      let _isTop2: boolean;
      let _isTop3: boolean;

      isMain = false;
      _isTop1 = false;
      _isTop2 = false;
      _isTop3 = false;

      if (dataRecordPlayers[i].userName == "ngockylan2") {
        isMain = true;
      } else {
        isMain = false;
      }

      if (i == 0) {
        _isTop1 = true;
      } else if (i == 1) {
        _isTop2 = true;
      } else if (i == 2) {
        _isTop3 = true;
      }
      this._listItems.push({
        id: i + 1,
        content1: dataRecordPlayers[i].userName,
        content2: Global.instance.formatNumberWithCommas(dataRecordPlayers[i].coin),
        avatarID: dataRecordPlayers[i].avatarID,
        isMain: isMain,
        isTop1: _isTop1,
        isTop2: _isTop2,
        isTop3: _isTop3,
      });
    }
    this.tableView && this.tableView.reloadData();
  }
}
