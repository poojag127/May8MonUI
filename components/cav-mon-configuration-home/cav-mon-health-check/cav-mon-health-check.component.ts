import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationService, TreeNode } from 'primeng/primeng';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import { MonHealthCheckService } from '../../../services/mon-health-check-services';
import * as _ from "lodash";
import { UtilityService } from '../../../services/utility.service';
import { HealthCheckMonData } from '../../../containers/health-check-data';
import { HealthCheckTableData } from '../../../containers/health-check-tabledata';
import { ImmutableArray } from '../../../utility/immutable-array';
import { MonDataService } from '../../../services/mon-data.service';
import { MessageService } from '../../../services/message.service';
import { GlobalProps } from '../../../containers/global-prop';
import { HealthCheckParams } from '../../../containers/health-check-params';
import * as COMPONENT from '../../../constants/mon-component-constants';

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
  checked: boolean = false;

  tierList: any[] = [];

  serverList: any[] = [];

  tierHeadersList: any[] = [];

  heathCheckMonData: HealthCheckMonData;

  heathCheckMonitorData: TreeNode[] = [];

  tierNode: HealthCheckTableData;

  serverNode: HealthCheckTableData;

  healthChkTypeNode: HealthCheckTableData;

  /*This variable is used to store the options for the health check type*/
  healthCheckList: any[] = [];

  topoName: string;
  monName: string;
  mjsonName: string;

  globalProps: GlobalProps;

  healthCheckParam: HealthCheckParams;

  /*This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality */
  tempId: number = 0;

  selectedFile: TreeNode;

  uniqueKey: any[] = [];

  editMode: boolean = false;

  enableHealthCheckMon: boolean = false;

  constructor(private monConfServiceObj: MonConfigurationService,
    private dialogRef: MdDialogRef<CavMonHealthCheckComponent>,
    private confirmationService: ConfirmationService,
    private utilityService: UtilityService,
    private healthChkMonServiceObj: MonHealthCheckService,
    public monDataService: MonDataService,
    private messageService: MessageService,

  ) { }

  ngOnInit() {
    console.log("Method ngOnInit called, heathCheckMonitorData = ", this.heathCheckMonitorData + "and global = ", this.globalProps);
    // if(this.heathChheckMonitorData != undefined && this.globalProps != undefined)
    this.globalProps = new GlobalProps();
    let that = this;
    this.healthChkMonServiceObj.getHealthChkMonData(this.globalProps).subscribe(data => {
      console.log("data = ", data)
      if (data['customConfiguratons'] != null) {
        that.healthChkMonServiceObj.setHealthCheckTreeTableData(data['customConfiguratons']['data']);
        that.createUniqueKeyForInstanceValidations(data['customConfiguratons']['data']);
        that.heathCheckMonitorData = data['customConfiguratons']['data'];
      }

      if (data['globalConfiguration'] != null)
        that.globalProps = data['globalConfiguration']
    })

    console.log("globalProps = ", this.globalProps)
    console.log("Method CavMonHealthCheckComponent called")
    this.heathCheckMonData = new HealthCheckMonData();

    this.tierHeadersList = this.monConfServiceObj.getTierHeaderList();
    let tierList = [];
    this.tierHeadersList.map(function (each) {
      if (each.name != "All Tiers")
        tierList.push(each.name)
    })
    console.log("tierList CavMonHealthCheckComponentcalled= " + tierList)
    this.tierList = UtilityService.createDropdown(tierList);
    this.tierList = this.tierList.concat({ label: 'Others', value: 'Others' });

    console.log("final tierList = ", this.tierList)

    //creating dropdown list for health check type
    let healthChkLabel = ['Ping', 'HTTP', 'Socket'];
    let healthCheckVal = ['Ping', 'Http', 'Socket'];
    this.healthCheckList = UtilityService.createListWithKeyValue(healthChkLabel, healthCheckVal);



  }

/**
 * Need to create in case of data receiving from server
 * @param heathCheckMonitorData 
 */
  createUniqueKeyForInstanceValidations(heathCheckMonitorData)
  {
    let uniqueKey = [];
    console.log("Method createUniqueKeyForInstanceValidations called",heathCheckMonitorData)
    heathCheckMonitorData.map(function(each){
      let tierName = each['data']['nodeName'];
      let serverList = each['children'];
      serverList.map(function(each){
        let serverName = each['data']['nodeName'];
        let healthChkList = each['children'];
        healthChkList.map(function(each){
          let helthChkTypeName =  each['data']['nodeName'];
          let key = tierName + serverName + helthChkTypeName + each['data']['instanceInfo']['instName'];
          uniqueKey.push(key);
      })
    })
   })
   console.log("On edit creating uniqueKey = ",uniqueKey)
   this.uniqueKey= uniqueKey;
  }
  

  nodeSelect(event) {
    console.log("event = ", event)
  }


  onTierChange(tierName) {
    console.log("Method onTierChange called, tierName ", tierName)
    let tierInfo
    if (tierName != "Others") // if tier is Others that means no request to be sent to the server for getting the tierlist.
    {
      tierInfo = _.find(this.tierHeadersList, function (each) { return each['name'] == tierName })
    }


    /*** To get the server list in the dropdown ****/
    /*** Here unshift is used to insert element at 0 position of array 
     *** if Others is slectede for tiername then there should not be any request send to the server for getting the serverList**/
    console.log("tierInfo= ", tierInfo)
    if (tierInfo != undefined) {
      this.utilityService.getServerList(tierInfo.id)
        .subscribe(data => {
          if (data != null) {
            //  data["label"].unshift("All Servers");
            //  data["value"].unshift("All Servers");
            this.serverList = UtilityService.createListWithKeyValue(data["label"], data["value"]);
          }
        })

    }

  }

  dialogCloseEvent($evt?: any) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.dialogCloseEvent();
    this.monConfServiceObj.clearHideShowMonList();
  }


  validateData(heathCheckMonData) {
    console.log("Method validateData= ", heathCheckMonData)
    if (heathCheckMonData.healthCheckType == "Socket" || heathCheckMonData.healthCheckType == "Http") {
      if (heathCheckMonData.instName == '') {
        this.messageService.errorMessage("Please fill Instance Name");
        return false;
      }
    }

    /*Check for whether tier is selected or not*/
    if (heathCheckMonData.tierName == '') {
      this.messageService.errorMessage("Please select Tier");
      return false;
    }

    /*Check for whether server is selected or not*/
    if (heathCheckMonData.tierName != "Others" && heathCheckMonData.serverName == '') {
      this.messageService.errorMessage("Please select Server");
      return false;
    }

    return true;
  }

  /*this method is used to add data for the health check mon*/
  saveData()
   {
    if (!this.validateData(this.heathCheckMonData)) {
      console.log("Method  saveData called returning")
      return;
    }
    console.log("Method saveData() called, savedata= ", this.heathCheckMonData)
    console.log("Method savedtaa called = ", this.globalProps)

    let treeTableData = this.healthChkMonServiceObj.getHealthCheckTreeTableData();
    let id = treeTableData.length + 1 + "";
    this.tierNode = new HealthCheckTableData();

    let tierName;
    if (this.heathCheckMonData.tierName != "Others")
      tierName = this.heathCheckMonData.tierName;
    else
      tierName = this.heathCheckMonData.customTierName;

    console.log("tierName = ", tierName)

    let serverName;
    if (this.heathCheckMonData.tierName != "Others")
      serverName = this.heathCheckMonData.serverName;
    else
      serverName = this.heathCheckMonData.customServerName;


    console.log("this.heathCheckMonData.serverName = ", this.heathCheckMonData.serverName)
    let healthCheckTypeName = this.heathCheckMonData.healthCheckType;

    let tierObj = _.find(treeTableData, function (each) { return each.data.nodeName == tierName });
    console.log("tierObj = ", tierObj)

    if (tierObj == null) {
      let arr2 = [];
      arr2.push(this.globalProps);
      console.log("this = ", this.tierNode)
      let tierNode = {
        "nodeName": tierName,
        "arguments": this.heathCheckMonData.enableTier ? "true" : "false",
        "leaf": false,
        "instanceInfo": arr2,
        "enabled": true
      }
      console.log("tierNode here = ", tierNode.arguments)

      // this.tierNode.nodeName = this.heathCheckMonData.tierName;
      // this.tierNode.arguments = this.heathCheckMonData.enableTier ? "Active" : "Inactive";

      // this.serverNode = new HealthCheckTableData();
      // this.serverNode.nodeName = this.heathCheckMonData.serverName;
      // this.serverNode.arguments = this.heathCheckMonData.enableServer ? "Active" :"Inactive";
      let serverNode = {
        "nodeName": serverName,
        "arguments": this.heathCheckMonData.enableServer ? "true" : "false",
        "leaf": false,
        "instanceInfo": arr2,
        "enabled": true
      }



      this.healthChkTypeNode = new HealthCheckTableData();
      this.healthChkTypeNode.nodeName = healthCheckTypeName;

      let healthChkTypeString = this.createHealthTypeString(this.heathCheckMonData);
      console.log("this.heathCheckMonData.healthCheckType", healthChkTypeString)

      let arr = [];
      arr.push(this.heathCheckMonData);
      let healthChkTypeNode = {
        "nodeName": this.heathCheckMonData.healthCheckType,
        "arguments": healthChkTypeString,
        "instanceInfo": arr,
        "leaf": true,
        "enabled": false
      }

      let key = tierName + serverName + healthCheckTypeName+this.heathCheckMonData.instName;
      this.uniqueKey.push(key);

      console.log("healthChkTypeString= " + healthChkTypeNode.arguments)
      console.log("healthChkTypeString =" + healthChkTypeString)

      console.log("this.healthChkTypeNode = ", this.healthChkTypeNode)

      let serChildArr = [];
      let healthChkTypeArr = [];
      healthChkTypeArr.push({
        "id": id + ".1.1",
        "data": healthChkTypeNode,
        "children": [],
        "leaf": true
      })

      console.log("healthChkTypeArr = ", healthChkTypeArr)

      let that = this;
      serChildArr.push({
        "id": id + ".1",
        "data": serverNode,
        "children": healthChkTypeArr,
        "leaf": false
      })


      let newTierNode = {
        "id": id,
        "data": tierNode,
        "leaf": false,
        "children": serChildArr,
      }
      console.log("newTierNode = ", newTierNode)

      this.heathCheckMonitorData = ImmutableArray.push(this.heathCheckMonitorData, newTierNode);
      console.log(" this.heathCheckMonitorData New row added ", this.heathCheckMonitorData)

      this.healthChkMonServiceObj.setHealthCheckTreeTableData(this.heathCheckMonitorData);
      this.heathCheckMonData = new HealthCheckMonData();
    }
    else {
      //alredy tier Node is  there now checking for server Node alreday exist or not
      if (tierObj.children.length != 0) {
        let serverArr = tierObj.children;
        let existingServerNode = _.find(serverArr, function (each) { return each.data.nodeName == serverName });
        if (existingServerNode != null) {
          let typeNodeArr = existingServerNode.children;
          console.log("typeNodeArr = ", typeNodeArr)
          let healthChkTypeArr = typeNodeArr;
          console.log("healthChkTypeArr = ", healthChkTypeArr)
          let healthChkNodeId = existingServerNode.id + "." + (healthChkTypeArr.length + 1);
          if (healthChkTypeArr.length != 0) {
            let healthCheckTypeObj = _.find(healthChkTypeArr, function (each) { return each.data.nodeName == healthCheckTypeName });
            if (healthCheckTypeObj == null) {
              console.log("id of health Check Type Node = ", id)
              this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId)
            }
            else {
              if (healthCheckTypeName == "Ping") {
                if (!this.editMode) {
                  this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " server " + serverName);
                  return false;
                }
                else {
                  this.updateHealthCheckType(healthCheckTypeObj, this.heathCheckMonData);
                }
              }
              else {

                let key = tierName + serverName + healthCheckTypeName+this.heathCheckMonData.instName;
                if (this.editMode) {
                  this.updateHealthCheckType(healthCheckTypeObj, this.heathCheckMonData);
                }
                else {
                  console.log("this.uniqueKey = ",this.uniqueKey)
                  console.log("key = ",key)
                  if (this.uniqueKey.indexOf(key) != -1) {
                    this.messageService.errorMessage("This health check  is already configured on tier " + tierName + " server " + serverName + "and  instance " + this.heathCheckMonData.instName);
                    return;
                  }
                  else {
                    this.uniqueKey.push(key);
                    console.log("new instane ", healthChkNodeId)
                    this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId);
                  }
                }
              }
            }
          }
          else
            this.addhealthCheckNode(existingServerNode, this.heathCheckMonData, healthChkNodeId);
        }
        else
          this.addServerNode(tierObj, this.heathCheckMonData);
      }
      else {
        this.addServerNode(tierObj, this.heathCheckMonData);
      }

    }
    // console.log("arguments finally = " , this.healthCheckTableData.arguments)
    if (!this.editMode)
      this.messageService.successMessage("You have successfully added health check monitor");
    else
      this.messageService.successMessage("You have successfully updated health check monitor");

    this.heathCheckMonData = new HealthCheckMonData();
  }



  onCheckBoxChange(data, value) {
    console.log("data ", data)
    data.data.arguments = value + "";
    console.log("aftr chnagedata ", data)

  }

  addServerNode(tierObj, heathCheckMonData) {
    console.log("Method addServerNode called")

    let serverNodeData = {
      "nodeName": this.heathCheckMonData.serverName,
      "arguments": this.heathCheckMonData.enableServer ? "true" : "false",
      "leaf": false,
      "instanceInfo": [],
      "enabled": true
    }
    let id = tierObj.id + "." + (tierObj.children.length + 1);
    let serverNode = {
      "id": id,
      "data": serverNodeData,
      "children": [],
      "leaf": false
    }

    let healthChkID = serverNode.id + "." + (serverNode.children.length + 1);
    console.log("healthChkID = ", healthChkID)
    this.addhealthCheckNode(serverNode, heathCheckMonData, healthChkID);
    tierObj.children.push(serverNode)
  }

  addhealthCheckNode(serverNode, healthCheckDataMon, id) {
    console.log("addhealthCheckNode= ", id, serverNode, healthCheckDataMon)
    let healthChkTypeString = '';

    if (this.heathCheckMonData.healthCheckType == "Ping") {
      healthChkTypeString = "Host = " + this.heathCheckMonData.host;

      if (this.heathCheckMonData.pingPkt != null) {
        healthChkTypeString = ", Packet Count = " + this.heathCheckMonData.pingPkt;
      }
      if (this.heathCheckMonData.pingIntrvl != null) {
        healthChkTypeString = ", Wait Interval = " + this.heathCheckMonData.pingIntrvl;
      }
    }
    else if (this.heathCheckMonData.healthCheckType == "Socket") {
      healthChkTypeString = "Host = " + this.heathCheckMonData.host + ",Port = " + this.heathCheckMonData.port + ", Instance Name = " + this.heathCheckMonData.instName;
      if (this.heathCheckMonData.sockeTo != null)
        healthChkTypeString + " TimeOut = " + this.heathCheckMonData.sockeTo;
    }
    else if (this.heathCheckMonData.healthCheckType == "Http") {
      healthChkTypeString = "Url = " + this.heathCheckMonData.url + ", Instance = " + this.heathCheckMonData.instName;
      if (this.heathCheckMonData.user != null) {
        healthChkTypeString = healthChkTypeString + ", User Name = " + this.heathCheckMonData.user;
      }
      if (this.heathCheckMonData.pwd != null) {
        healthChkTypeString = healthChkTypeString + ", Password = " + this.heathCheckMonData.pwd;
      }
      if (this.heathCheckMonData.sockeTo != null) {
        healthChkTypeString = healthChkTypeString + ", Status Code = " + this.heathCheckMonData.httpSc;
      }
    }

    let arr = [];
    arr.push(this.heathCheckMonData);
    let healthChkTypeNode = {
      "nodeName": this.heathCheckMonData.healthCheckType,
      "arguments": healthChkTypeString,
      "instanceInfo": arr,
      "leaf": true
    }

    serverNode.children.push({
      "id": id,
      "data": healthChkTypeNode,
      "children": [],
      "leaf": true
    })
  }

  saveFinalData() {
    console.log("method finalSubmit =", this.heathCheckMonitorData)
    let customConfiguratons = this.heathCheckMonitorData;
    console.log("customConfiguratons =", customConfiguratons)

    // if (customConfiguratons.length == 0) {
    //   this.messageService.errorMessage("Server Health monitor is not configured");
    //   return;
    // }

    if(!this.validataGlobalData(this.globalProps))
    {
      return;
    }

    this.heathCheckMonData = new HealthCheckMonData();
    console.log("globalConfiguration= ", this.globalProps)

    // let configuredData =  JSON.parse(JSON.stringify(this.heathCheckMonitorData));
    this.healthChkMonServiceObj.savehealthCheckData(this.heathCheckMonitorData, this.globalProps, this.enableHealthCheckMon)
      .subscribe(data => {
        console.log("data = ", data)
      });


    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  validataGlobalData(globalData)
  {
    console.log("globalData=",globalData)
    if(globalData.pingPkt == null ||globalData.pingPkt =='')
    {
      this.messageService.errorMessage("Enter Packet value for Ping health check settings")
      return false;
    }

    if(globalData.pingIntrvl == null ||globalData.pingIntrvl == '')    
    {
      this.messageService.errorMessage("Enter Interval for Ping health check settings")
      return false;
    }

    if(globalData.pingIntrvl == null ||globalData.pingTP == '')    
    {
      this.messageService.errorMessage("Enter Thread Pool value for Ping health check settings")
      return false;
    }

    if(globalData.httpSc == null||globalData.httpSc == '')    
    {
      this.messageService.errorMessage("Enter Status code for Http health check settings")
      return false;
    }

    
    if(globalData.httpCTO == null ||globalData.httpCTO == '')    
    {
      this.messageService.errorMessage("Enter Connection Time Out value for Http health check settings")
      return false;
    }

     if(globalData.httpRTO == null ||globalData.httpRTO == '')    
    {
      this.messageService.errorMessage("Enter Response Time Out value for Http health check settings")
      return false;
    }

    if(globalData.sockeTo == null ||globalData.sockeTo == '')    
    {
      this.messageService.errorMessage("Enter  Time Out value for Socket health check settings")
      return false;
    }
    return true;
  }

  /*
   * This method is called when user clicks on the edit option 
   * for updating the selected treetable configuration.
   */

  editHealthMonData(rowData) {
    console.log("Method editHealthMonData called, rowData=  ", rowData)
    this.heathCheckMonData = rowData.data.instanceInfo[0];
    console.log(" this.heathCheckMonData  ", this.heathCheckMonData)
    this.editMode = true;
  } 

  showHiddenMonitors()
  {
     console.log("Medthod showHiddenMonitors caclled")
  }

  finalSave()
  {
    console.log("Medthod finalSave caclled")
  }

  deleteNode(nodeArr, idToDelete) {
    nodeArr = nodeArr.filter(function (val) {
      console.log("val['id']", val['id'])
      console.log(idToDelete.indexOf(val['id']) == -1)
      return idToDelete.indexOf(val['id']) == -1;
    })

    console.log("healthChkTypeArr", nodeArr)
    return nodeArr;
  }

  deleteTierNode(selectedTierNodeId) {
    this.heathCheckMonitorData = this.deleteNode(this.heathCheckMonitorData, selectedTierNodeId);
  }

  deleteServerNode(arrSplitId, arrId) {
    let tierNodeObj = this.getTierObj(arrSplitId);
    tierNodeObj.children = this.deleteNode(tierNodeObj.children, arrId)
  }

  deleteHealthChkTypeNode(arrSplitId, arrId) {
    let tierNodeObj = this.getTierObj(arrSplitId);
    let serverNodeObj = this.getServerObj(arrSplitId, tierNodeObj.children);
    serverNodeObj.children = this.deleteNode(serverNodeObj.children, arrId)


  }


  getServerObj(arrSplitId, serverNodeArr) {
    console.log("Method getServerObj called ")
    let serverNodeObj = _.find(serverNodeArr, function (each) {
      let serverId = each['id'].split(".");
      return serverId[1] == arrSplitId[1];
    })
    console.log("Slected ServerNode = ", serverNodeObj)
    return serverNodeObj;

  }

  getTierObj(arrSplitId) {
    let tierNodeObj = _.find(this.heathCheckMonitorData, function (each) {
      console.log("each = ", each['id'])
      console.log("arrPlit = ", arrSplitId[0])
      console.log("chk = ", each['id'] == arrSplitId[0])
      return each['id'] == arrSplitId[0]
    })
    console.log("Slected TierNode = ", tierNodeObj)
    return tierNodeObj;
  }

  getAndDeleteNodeSelected(selectedNodeId) {
    let arrId = [];
    arrId.push(selectedNodeId) // push selected row's id 
    let arrSplitId = selectedNodeId.split(".");
    if (arrSplitId.length == 1) {
      this.deleteTierNode(arrId)
    }
    else if (arrSplitId.length == 2) {
      this.deleteServerNode(arrSplitId, arrId)
    }
    else if (arrSplitId.length == 3) {
      this.deleteHealthChkTypeNode(arrSplitId, arrId)
    }
  }

  /*This method is used to delete selected rows*/
  deleteHealthMonData(rowData) {
    console.log("deleteHealthMonData= ", rowData)
    let that = this;
    this.confirmationService.confirm({
      message: COMPONENT.DELETE_SPECIFIC_CONFIGURATION,
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        arrId.push(rowData.id) // push selected row's id 
        let arrSplitId = rowData.id.split(".");
        that.getAndDeleteNodeSelected(rowData.id);
        console.log("arrId= ", arrId)

      },
      reject: () => {
      }
    });

  }

  overrideGlobalSettings(value) {
    console.log("Method overrideGlobalSettings =", this.globalProps)
    console.log("this.healhChkMOnData = ", this.heathCheckMonData)
    this.heathCheckMonData.httpUrl = '';
    this.heathCheckMonData.httpUser = '';
    this.heathCheckMonData.httpPwd = '';
    this.heathCheckMonData.httpCTO = 10;
    this.heathCheckMonData.httpRTO = 30;
    this.heathCheckMonData.statusCode = "2xx";
    this.heathCheckMonData.pingIntrvl = 0.2;
    this.heathCheckMonData.pingPkt = 5;
    this.heathCheckMonData.sockeTo = -1;
  }

  

   updateHealthCheckType(healthCheckTypeNode,healthCheckMonData)
   {
    console.log("new healthCheckMonData = ",healthCheckMonData)
    console.log("healthCheckTypeNode = ",healthCheckTypeNode)
    this.createArguments(healthCheckTypeNode,healthCheckMonData)
    this.editMode = false;
  }

  createArguments(healthCheckTypeNode, healthCheckMonData) {
    let healthChkTypeString = this.createHealthTypeString(healthCheckMonData);
    healthCheckTypeNode.data.arguments = healthChkTypeString;
    let arr = [];
    arr.push(healthCheckMonData);
    healthCheckTypeNode.data.instanceInfo = arr;
  }

  createHealthTypeString(healthCheckMonData) {
    let healthChkTypeString = '';
    if (this.heathCheckMonData.healthCheckType == "Ping") {
      healthChkTypeString = "Host = " + this.heathCheckMonData.host;
      if (this.heathCheckMonData.pingPkt != null)
        healthChkTypeString = healthChkTypeString +", Packet Count = " + this.heathCheckMonData.pingPkt;

      if (this.heathCheckMonData.pingIntrvl != null)
        healthChkTypeString = healthChkTypeString + ", Wait Interval = " + this.heathCheckMonData.pingIntrvl;
    }

    else if (this.heathCheckMonData.healthCheckType == "Socket") {
      healthChkTypeString = "Host = " + this.heathCheckMonData.host +
                            ", Port = " + this.heathCheckMonData.port +
                            ", Instance Name = " + this.heathCheckMonData.instName;
      if (this.heathCheckMonData.sockeTo != null)
        healthChkTypeString = healthChkTypeString + ", Connection Timeout = " + this.heathCheckMonData.sockeTo;
        
      if (this.heathCheckMonData.user != null)
        healthChkTypeString = healthChkTypeString + ", User Name = " + this.heathCheckMonData.user;

      if (this.heathCheckMonData.pwd != null) 
          healthChkTypeString = healthChkTypeString + ", Password = " + this.heathCheckMonData.pwd;
    }

    else if (this.heathCheckMonData.healthCheckType == "Http") {
      healthChkTypeString = "Url = " + this.heathCheckMonData.url 
                        +  ", Instance = " + this.heathCheckMonData.instName;
      
      if (this.heathCheckMonData.user != null) {
        healthChkTypeString = healthChkTypeString + ", User Name = " + this.heathCheckMonData.user;
      }
      if (this.heathCheckMonData.pwd != null) {
        healthChkTypeString = healthChkTypeString + ", Password = " + this.heathCheckMonData.pwd;
      }
      if (this.heathCheckMonData.httpCTO != null) {
        healthChkTypeString = healthChkTypeString + ", Connection Timeout =" + this.heathCheckMonData.httpCTO;
      }
      if (this.heathCheckMonData.httpRTO != null) {
        healthChkTypeString = healthChkTypeString + ", Response Timeout = " + this.heathCheckMonData.httpRTO;
      }
    }
    return healthChkTypeString;
  }



  /*This method is called when user clicks on cancel button to close the configuration without making any changes.
  * This method shows a new form to perform ADD operation.
  */
  closeConfiguration() {
    
    this.heathCheckMonData = new HealthCheckMonData(); // for clearing form fields.
    this.editMode = false;
    
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


}
