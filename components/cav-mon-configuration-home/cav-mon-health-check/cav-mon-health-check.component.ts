import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {ConfirmationService, TreeNode} from 'primeng/primeng';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import { MonHealthCheckService } from '../../../services/mon-health-check-services';
import * as _ from "lodash";
import { UtilityService } from '../../../services/utility.service';
import { HealthCheckMonData } from '../../../containers/health-check-data';
import { HealthCheckTableData } from '../../../containers/health-check-tabledata';
import { ImmutableArray } from '../../../utility/immutable-array';
import { MonDataService } from '../../../services/mon-data.service';
import { MessageService } from '../../../services/message.service';


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

  healthCheckTableData: HealthCheckTableData


  /*This flag is used to bind value of the checkbox*/
  checked:boolean = false; 

  tierList:any[] =[];

  serverList:any[] = [];

  tierHeadersList:any[] = [];
  
  heathCheckMonData:HealthCheckMonData;

  heathCheckMonitorData:TreeNode[];

  tierNode:HealthCheckTableData;

  serverNode:HealthCheckTableData;

  healthChkTypeNode:HealthCheckTableData;

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
              private messageService: MessageService,
              
              ) { }

  ngOnInit()
  {
    console.log("proifile Name = ", this.monConfServiceObj.topoName, this.monConfServiceObj.profileName, this.monDataService.userName);
    // this.healthChkMonServiceObj.readHealthMonitorJson(this.monConfServiceObj.topoName, this.monConfServiceObj.profileName,  this.monDataService.getMonMode(), this.monDataService.userName, this.monDataService.getTestRunNum());
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
    // tierList.unshift("--Select --");
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
  
   let treeTableData = this.healthChkMonServiceObj.getHealthCheckTreeTableData();
   let id = treeTableData.length + 1;
   this.tierNode = new HealthCheckTableData();
   this.tierNode.nodeName = this.heathCheckMonData.tierName;
   this.tierNode.arguments = this.heathCheckMonData.enableTier;
   
   this.serverNode = new HealthCheckTableData();
   this.serverNode.nodeName = this.heathCheckMonData.serverName;
   this.serverNode.arguments = this.heathCheckMonData.enableServer;

   console.log("serverNode = ",this.serverNode)

   this.healthChkTypeNode = new HealthCheckTableData();
   this.healthChkTypeNode.nodeName = this.heathCheckMonData.healthCheckType;
   let healthChkTypeString = '';
   if(this.heathCheckMonData.healthCheckType == "Ping")
       healthChkTypeString = "Packet = " + this.heathCheckMonData.packet + ", Interval = " + this.heathCheckMonData.interval ;
   
   else if(this.heathCheckMonData.healthCheckType == "Socket")
     healthChkTypeString = "TimeOut = " + this.heathCheckMonData.timeOut  + ", ThreadPool = " +this.heathCheckMonData.threadPool;

   else if(this.heathCheckMonData.healthCheckType == "HTTP")
      healthChkTypeString = "Url = " + this.heathCheckMonData.proxyUrl + ", User Name = " + this.heathCheckMonData.userName + ", Password = " + this.heathCheckMonData.pwd;
     
   this.healthChkTypeNode.arguments = healthChkTypeString;

   console.log("this.healthChkTypeNode = ",this.healthChkTypeNode)
   
   let serChildArr = [];
   let healthChkTypeArr = [];
   healthChkTypeArr.push({
      "id":id + ".1.1",
      "data":this.healthChkTypeNode,
      "children":[],
      "leaf":true
   })

   console.log("healthChkTypeArr = ",healthChkTypeArr)
   
   let that = this;
   serChildArr.push({
      "id": id + ".1",
      "data": this.serverNode,
      "children":healthChkTypeArr,
      "leaf":false
   })


   let newTierNode = {
     "id":id,
     "data": this.tierNode,
     "leaf": false,
     "children": serChildArr
      }
     console.log("newTierNode = ",newTierNode)

     this.heathCheckMonitorData = ImmutableArray.push(this.heathCheckMonitorData, newTierNode);
     this.messageService.successMessage("You have successfully added health check monitor");
  }

  finalSubmit()
  {
    let ping;
    let socket;
    let http;
    console.log("method finalSubmit =", this.heathCheckMonitorData )
    

    if(this.dialogRef) 
    {
      this.dialogRef.close();
    }
  }

}
