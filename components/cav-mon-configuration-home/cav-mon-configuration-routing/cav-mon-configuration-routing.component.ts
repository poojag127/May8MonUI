import { Component, OnInit,  OnDestroy } from '@angular/core';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import { MonDataService } from '../../../services/mon-data.service';

@Component({
  selector: 'app-cav-mon-configuration-routing',
  templateUrl: './cav-mon-configuration-routing.component.html',
  styleUrls: ['./cav-mon-configuration-routing.component.css']
})
export class CavMonConfigurationRoutingComponent implements OnInit, OnDestroy {

  constructor(private _configService: MonConfigurationService, private _dataService: MonDataService) { }

  ngOnInit() {
    console.log('CavMonConfigurationRoutingComponent | test run num = ', this._dataService.getTestRunNum());
    if(this._dataService.getTestRunNum() !== -1)
      this._configService.clearData();
  }

  ngOnDestroy() {
  }
}
