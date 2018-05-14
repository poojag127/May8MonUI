import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {ConfirmationService, TreeNode} from 'primeng/primeng';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import * as _ from "lodash";
import { UtilityService } from '../../../services/utility.service';
import { HealthCheckMonData } from '../../../containers/health-check-data';


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


  constructor(private monConfServiceObj: MonConfigurationService,
              private dialogRef: MdDialogRef<CavMonHealthCheckComponent>, 
              private confirmationService: ConfirmationService,
              private utilityService:UtilityService
              ) { }

  ngOnInit()
  {
    console.log("Method CavMonHealthCheckComponent called")
    this.heathCheckMonData =  new HealthCheckMonData();
    this.tierHeadersList = this.monConfServiceObj.getTierHeaderList();
    let tierList = _.map(this.tierHeadersList, _.pick('name'));
    tierList.unshift("--Select --");
    console.log("tierList CavMonHealthCheckComponentcalled= "+tierList)
    this.tierList = UtilityService.createDropdown(tierList);
  }

  onTierChange(tierName)
  {
    console.log("Method onTierChange called ")
    let tierId = _.find(this.tierHeadersList,function(each) { return each['name'] == tierName})
    
      /*** To get the server list in the dropdown ****/
     /*** Here unshift is used to insert element at 0 position of array ****/
     this.utilityService.getServerList(tierId)
     .subscribe(data => {
                if(data != null)
                {
                  data["label"].unshift("All Servers");
                  data["value"].unshift("All Servers");
                  this.serverList = UtilityService.createListWithKeyValue(data["label"], data["value"]);
                }
              })

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

}
