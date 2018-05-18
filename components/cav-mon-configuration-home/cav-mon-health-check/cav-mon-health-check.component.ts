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
import { GlobalProps} from '../../../containers/global-prop';
import { HealthCheckParams } from '../../../containers/health-check-params';


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

  heathCheckMonitorData:TreeNode[]=[];

  tierNode:HealthCheckTableData;

  serverNode:HealthCheckTableData;

  healthChkTypeNode:HealthCheckTableData;

  /*This variable is used to store the options for the health check type*/
  healthCheckList:any[] = [];

  topoName:string;
  monName:string;
  mjsonName:string;

  globalProps:GlobalProps;

  healthCheckParam:HealthCheckParams;

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
    this.globalProps = new GlobalProps();
    console.log("globalProps = ",this.globalProps)
    console.log("proifile Name = ", this.monConfServiceObj.topoName, this.monConfServiceObj.profileName, this.monDataService.userName);
    // this.healthChkMonServiceObj.readHealthMonitorJson(this.monConfServiceObj.topoName, this.monConfServiceObj.profileName,  this.monDataService.getMonMode(), this.monDataService.userName, this.monDataService.getTestRunNum());
    console.log("Method CavMonHealthCheckComponent called")
    this.heathCheckMonData =  new HealthCheckMonData();
    // this.heathCheckMonitorData = this.healthChkMonServiceObj.getHealthCheckTreeTableDate();
    //  this.healthChkMonServiceObj.getHealthCheckTreeTableData().then(files => this.heathCheckMonitorData = files);
    // this.healthChkMonServiceObj.setHealthCheckTreeTableData(this.heathCheckMonitorData);
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
   console.log("Method savedtaa called = ",this.globalProps)
  
   let treeTableData = this.healthChkMonServiceObj.getHealthCheckTreeTableData();
   let id = treeTableData.length + 1;
   this.tierNode = new HealthCheckTableData();
   

   let tierName = this.heathCheckMonData.tierName;
   let serverName = this.heathCheckMonData.serverName;
   let healthCheckTypeName = this.heathCheckMonData.healthCheckType;

   let tierObj = _.find(treeTableData,function(each) { return each.data.nodeName == tierName});
   console.log("tierObj = ",tierObj)
   
   if(tierObj == null)
   {
    let arr2 = [];
    arr2.push(this.heathCheckMonData);
    console.log("this = ",this.tierNode)
    let tierNode  = { "nodeName":this.heathCheckMonData.tierName,
                      "arguments":this.heathCheckMonData.enableTier,
                      "leaf":false,
                      "instanceInfo":arr2
                   }
    // this.tierNode.nodeName = this.heathCheckMonData.tierName;
    // this.tierNode.arguments = this.heathCheckMonData.enableTier ? "Active" : "Inactive";
   
    // this.serverNode = new HealthCheckTableData();
    // this.serverNode.nodeName = this.heathCheckMonData.serverName;
    // this.serverNode.arguments = this.heathCheckMonData.enableServer ? "Active" :"Inactive";
    let serverNode = { "nodeName":this.heathCheckMonData.serverName,
                      "arguments":this.heathCheckMonData.enableServer,
                       "leaf":false,
                      "instanceInfo":arr2
    }

    this.addhealthCheckNode(serverNode,this.heathCheckMonData);
    
    console.log("serverNode = ",this.serverNode)

   this.healthChkTypeNode = new HealthCheckTableData();
   this.healthChkTypeNode.nodeName = healthCheckTypeName;

   let healthChkTypeString = '';
   if(this.heathCheckMonData.healthCheckType == "Ping")
       healthChkTypeString = "Packet = " + this.heathCheckMonData.pingPkt + ", Host = " + this.heathCheckMonData.hostName +  ", Interval = " + this.heathCheckMonData.pingIntrvl ;
   
   else if(this.heathCheckMonData.healthCheckType == "Socket")
     healthChkTypeString = "TimeOut = " + this.heathCheckMonData.sockeTo  + ", ThreadPool = " +this.heathCheckMonData.socketTP +  ", Instance Name = " + this.heathCheckMonData.instanceName + ", Host = " + this.heathCheckMonData.hostName + ", Port = " + this.heathCheckMonData.port; 

   else if(this.heathCheckMonData.healthCheckType == "HTTP")
      healthChkTypeString = "Url = " + this.heathCheckMonData.httpUser + ", User Name = " + this.heathCheckMonData.httpUser + ", Password = " + this.heathCheckMonData.httpPwd + ", Status Code = " + this.heathCheckMonData.httpSc;
     
    let arr = [];
    arr.push(this.heathCheckMonData);
    let healthChkTypeNode = { 
          "nodeName":this.heathCheckMonData.healthCheckType,
          "arguments":healthChkTypeString,
          "instanceInfo":arr,
          "leaf":true
    }

   console.log("this.healthChkTypeNode = ",this.healthChkTypeNode)
   
   let serChildArr = [];
   let healthChkTypeArr = [];
   healthChkTypeArr.push({
      "id":id + ".1.1",
      "data":healthChkTypeNode,
      "children":[],
      "leaf":true
   })

   console.log("healthChkTypeArr = ",healthChkTypeArr)
   
   let that = this;
   serChildArr.push({
      "id": id + ".1",
      "data": serverNode,
      "children":healthChkTypeArr,
      "leaf":false
   })


   let newTierNode = {
     "id":id,
     "data": tierNode,
     "leaf": false,
     "children": serChildArr
      }
     console.log("newTierNode = ",newTierNode)

     console.log(" this.heathCheckMonitorData = ", this.heathCheckMonitorData)

     this.heathCheckMonitorData = ImmutableArray.push(this.heathCheckMonitorData, newTierNode);
     this.messageService.successMessage("You have successfully added health check monitor");
     this.heathCheckMonData = new HealthCheckMonData();
  }
  else {
    //alredy tier Node is  there now checking for server Node alreday exist or not
    if(tierObj.children.length != 0)
    {
      let serverArr = tierObj.children;
      let existingServerNode = _.find(serverArr,function(each) { return each.data.nodeName == serverName});
      if(existingServerNode != null)
      {
       let typeNodeArr = existingServerNode.children;
       if(typeNodeArr.children.length != 0)
       {
         let healthChkTypeArr = typeNodeArr.children;
         let healthCheckTypeObj  = _.find(healthChkTypeArr,function(each) { return each.data.nodeName == healthCheckTypeName});
         if(healthCheckTypeObj == null)
            this.addhealthCheckNode(existingServerNode)
         else
         {
           if(healthCheckTypeName != "Socket")
           {
             //return n promot msg
           }
           else{

           }
         }
       } 
       else
         this.addhealthCheckNode(existingServerNode);
      }
      else
          this.addServerNode(tierObj);    
    }
    else
    {
      this.addServerNode(tierObj);
    }

  }
}
 
  addServerNode(tierObj)
  {
    console.log("Method addServerNode called")
  }

  addhealthCheckNode(serverNode,healthCheckDataMon,id)
  {
  let healthChkTypeString = '';
   if(this.heathCheckMonData.healthCheckType == "Ping")
       healthChkTypeString = "Packet = " + this.heathCheckMonData.pingPkt + ", Host = " + this.heathCheckMonData.hostName +  ", Interval = " + this.heathCheckMonData.pingIntrvl ;
   
   else if(this.heathCheckMonData.healthCheckType == "Socket")
     healthChkTypeString = "TimeOut = " + this.heathCheckMonData.sockeTo  + ", ThreadPool = " +this.heathCheckMonData.socketTP +  ", Instance Name = " + this.heathCheckMonData.instanceName + ", Host = " + this.heathCheckMonData.hostName + ", Port = " + this.heathCheckMonData.port; 

   else if(this.heathCheckMonData.healthCheckType == "HTTP")
      healthChkTypeString = "Url = " + this.heathCheckMonData.httpUser + ", User Name = " + this.heathCheckMonData.httpUser + ", Password = " + this.heathCheckMonData.httpPwd + ", Status Code = " + this.heathCheckMonData.httpSc;
     
    let arr = [];
    arr.push(this.heathCheckMonData);
    let healthChkTypeNode = { 
          "nodeName":this.heathCheckMonData.healthCheckType,
          "arguments":healthChkTypeString,
          "instanceInfo":arr,
          "leaf":true
    }


   let healthChkTypeArr = [];
   healthChkTypeArr.push({
      "id":id ,
      "data":healthChkTypeNode,
      "children":[],
      "leaf":true
   })

   serverNode.children = healthChkTypeArr;

    

  }

  finalSubmit()
  {
    console.log("method finalSubmit =", this.heathCheckMonitorData )
    let customConfiguratons = this.heathCheckMonitorData;
    console.log("customConfiguratons =", customConfiguratons)

    this.heathCheckMonData =  new HealthCheckMonData();
    console.log("globalConfiguration= ", this.globalProps)

    this.healthChkMonServiceObj.savehealthCheckData(this.heathCheckMonitorData,this.globalProps)
        .subscribe(data =>{
      console.log("data = ",data)
    });
    

    if(this.dialogRef) 
    {
      this.dialogRef.close();
    }
  }

}
