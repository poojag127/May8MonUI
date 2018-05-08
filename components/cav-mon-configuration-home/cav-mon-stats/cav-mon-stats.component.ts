import { Component, OnInit, OnDestroy, Optional, Inject } from '@angular/core';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MonGroupInfoData } from '../../../containers/mon-group-info-data';

class monInfoObj {
  gdfName: string;
  description: string;
}

@Component({
  selector: 'app-cav-mon-stats',
  templateUrl: './cav-mon-stats.component.html',
  styleUrls: ['./cav-mon-stats.component.css']
})

export class CavMonStatsComponent implements OnInit, OnDestroy {
  monitorName: string = '';
  metadata: string = '';
  description: string = '';
  metricTable: any =[];
  displayGdf: boolean = true;
  arrMonInfo: monInfoObj[] = [];
  arrPerGrpData: MonGroupInfoData[] = [];

  constructor(private _monConfigService: MonConfigurationService, private dialogRef: MdDialogRef<CavMonStatsComponent>, 
              @Optional() @Inject(MD_DIALOG_DATA) public data : { name: monInfoObj[], monName: string }) { 
    this.arrMonInfo = (this.data) ? this.data.name: [];
    this.monitorName = (this.data) ? this.data.monName: '';
  }

  ngOnInit() {
    let gdfList = '';
    if(this.arrMonInfo.length > 0) {
        for(let i = 0; i < this.arrMonInfo.length; i++) {
          if(gdfList)
            gdfList = gdfList + ',' + this.arrMonInfo[i].gdfName;
          else 
            gdfList = this.arrMonInfo[i].gdfName;
        }
    }

    if(gdfList) {
      this._monConfigService.getMonitorsStatsList(gdfList).subscribe(data => {
        this.arrPerGrpData = data;
      });
    }
  }

  dialogCloseEvent($evt?: any) {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.dialogCloseEvent();
  }
}
