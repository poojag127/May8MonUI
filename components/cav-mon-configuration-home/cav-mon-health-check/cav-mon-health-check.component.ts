import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {ConfirmationService, TreeNode} from 'primeng/primeng';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import { MonHealthCheckService } from '../../../services/mon-health-check-services';
import * as _ from "lodash";
import { UtilityService } from '../../../services/utility.service';
import { HealthCheckMonData } from '../../../containers/health-check-data';
import { MonDataService } from '../../../services/mon-data.service';


@Component({
  selector: 'app-cav-mon-health-check',
  templateUrl: './cav-mon-health-check.component.html',
  styleUrls: ['./cav-mon-health-check.component.css']
})

export class CavMonHealthCheckComponent implements OnInit {

  /* Available Tree nodes. */
  nodes: TreeNode[];

  /* This flag is used to make dialog for show hidden monitors visible */
  displayDialog: boolean = true;


  /*This flag is used to bind value of the checkbox*/
  checked:boolean = false; 

  tierList:any[] =[];

  serverList:any[] = [];

  tierHeadersList:any[] = [];
  
  heathCheckMonData:HealthCheckMonData;

  heathCheckMonitorData:TreeNode[];

  /*This variable is used to store the options for the health check type*/
  healthCheckList:any[] = [];

  topoName:string;
  monName:string;
  mjsonName:string;

  constructor(private monConfServiceObj: MonConfigurationService,
              private dialogRef: MdDialogRef<CavMonHealthCheckComponent>, 
              private confirmationService: ConfirmationService,
              private utilityService:UtilityService,
              private healthChkMonServiceObj: MonHealthCheckService,
              public monDataService: MonDataService,
              
              ) { }

  ngOnInit()
  {
    console.log("proifile Name = ", this.monConfServiceObj.topoName, this.monConfServiceObj.profileName, this.monDataService.userName);
    this.healthChkMonServiceObj.readHealthMonitorJson(this.monConfServiceObj.topoName, this.monConfServiceObj.profileName,  this.monDataService.getMonMode(), this.monDataService.userName, this.monDataService.getTestRunNum());
    console.log("Method CavMonHealthCheckComponent called")
    this.heathCheckMonData =  new HealthCheckMonData();
    // this.heathCheckMonitorData = this.healthChkMonServiceOobj.getHealthCheckTreeTableDate();
    //  this.healthChkMonServiceObj.getHealthCheckTreeTableData().then(files => this.heathCheckMonitorData = files);
    this.healthChkMonServiceObj.setHealthCheckTreeTableData(this.heathCheckMonitorData);
    this.heathCheckMonitorData = this.healthChkMonServiceObj.getHealthCheckTreeTableData();
    this.tierHeadersList = this.monConfServiceObj.getTierHeaderList();
    let tierList = [];
    this.tierHeadersList.map(function(each){
      tierList.push(each.name)
    })
    tierList.unshift("--Select --");
    console.log("tierList CavMonHealthCheckComponentcalled= "+tierList)
    this.tierList = UtilityService.createDropdown(tierList);

    //creating dropdown list for health check type
    let healthChkLabel = ['Ping', 'HTTP', 'Socket'];
    let healthCheckVal = ['Ping', 'HTTP', 'Socket'];
    this.healthCheckList = UtilityService.createListWithKeyValue(healthChkLabel, healthCheckVal);
    
  }
  
  nodeSelect(event)
  {
    console.log("event = ",event)
  }


  onTierChange(tierName)
  {
    console.log("Method onTierChange called, tierName ", tierName)
    let tierInfo = _.find(this.tierHeadersList,function(each) { return each['name'] == tierName})

      /*** To get the server list in the dropdown ****/
     /*** Here unshift is used to insert element at 0 position of array ****/
     console.log("tierId- ", tierInfo.id)
     this.utilityService.getServerList(tierInfo.id)
     .subscribe(data => {
                if(data != null)
                {
                  data["label"].unshift("All Servers");
                  data["value"].unshift("All Servers");
                  this.serverList = UtilityService.createListWithKeyValue(data["label"], data["value"]);
                }
              })
console.log("this.serbverlist =", this.serverList)
  }

/* Function called when user wants to show the hidden monitor back in the treeTableData*/
addMonitor()
{   
  this.confirmationService.confirm({
    message: 'Are you sure you want to unhide monitor(s)?',
    header: 'Show Hidden Monitors Confirmation',
    accept: () => {
      console.log("Method addMonitors called , nodes = " , this.nodes)
      
      this.monConfServiceObj.showHiddenMonitors(this.nodes)
      this.monConfServiceObj.isFromAdd= true;
      this.dialogCloseEvent();
  },
    reject: () => {

    }
  });
}

 
  


  dialogCloseEvent($evt?: any) {
    if(this.dialogRef) 
    {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.dialogCloseEvent();
    this.monConfServiceObj.clearHideShowMonList();
  }

  /*this method is used to add data for the health check mon*/
  saveData()
  {
   console.log("Method saveData() called, savedata= ", this.heathCheckMonData)
  }

}
