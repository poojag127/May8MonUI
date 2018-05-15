import { Component, OnInit } from '@angular/core';
import { ConfirmationService,TreeNode } from 'primeng/primeng';
import { MonConfigurationService } from '../../services/mon-configuration.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as URL from '../../constants/mon-url-constants';
import * as COLOR_CODE from '../../constants/colorcode-constants';
import { Store } from '@ngrx/store';
import { MessageService } from '../../services/message.service';
import {MonDataService} from '../../services/mon-data.service';
import { TableData } from '../../containers/table-data';
import * as COMPONENT from '../../constants/mon-component-constants';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CavMonStatsComponent } from '../../components/cav-mon-configuration-home/cav-mon-stats/cav-mon-stats.component';
import * as _ from "lodash";
import { HideShowMonitorData } from '../../containers/hide-show-monitor-data';
import { CavMonHideShowComponent } from './cav-mon-hide-show/cav-mon-hide-show.component';
import { MonConfigData } from '../../containers/mon-config-data';
import { ServerConfigData } from '../../containers/server-config-data';
import { CavLayoutService } from "../../../../main/services/cav-layout-provider.service";
import { CavMonHealthCheckComponent } from "./cav-mon-health-check/cav-mon-health-check.component";

@Component({
  selector: 'app-cav-mon-configuration-home',
  templateUrl: './cav-mon-configuration-home.component.html',
  styleUrls: ['./cav-mon-configuration-home.component.css']
})

export class CavMonConfigurationHomeComponent implements OnInit {

  profileName: String;
 
  topoName: String;
 
  cols: any[] = [];
 
  compData: TreeNode[];

  checkBoxStateArr:any[]=[]; //used for storing state of checkboxes at tier level

  tempObj:{}={};  //used for contructing data to send to the server

   color = '#6495ed';


   hideShowMonitorData: HideShowMonitorData

   /*This flag is used for disabling the buttons as per mode
    * 0- Edit,
    * 1- View Mode,
    * 2- test run offline mode 
    * 3- run time mode 
    */
   modeStatus: boolean = false; 
   _dialogFileRef: MdDialogRef<CavMonStatsComponent>;
   _dialogForShowMon: MdDialogRef<CavMonHideShowComponent>;

   _dialogForHealthCheckMon:MdDialogRef<CavMonHealthCheckComponent>;
   
   disableShowHiddenMon:boolean = false;

   selectedFile: TreeNode;

   /*This variable is used to show the color code meaning for each monitor*/
   colorCodeInfo:string;

  /*This variable is used to show the title for viewing the gdf for each subCategory Monitor */
   showTitleForChildNodes:string;

   monConfigData : MonConfigData;

   logParserGdfList:any[] = [];

   getLogFileGDFData:any[] = [];
   
   serverConfData:ServerConfigData;

  constructor(private monConfServiceObj: MonConfigurationService,
              private router:Router,
              private route: ActivatedRoute,
              private store: Store<any>,
              private messageService: MessageService,
              private dataService : MonDataService,
              private _dialog: MdDialog,
              private confirmationService: ConfirmationService,
              private _cavLaoutService : CavLayoutService
   ) { }

  ngOnInit() 
  {

    console.log("profileName--",this.monConfServiceObj.getProfileName())

    // this.monConfServiceObj.restoreVariableFromSession();

    // let txSession = JSON.parse(localStorage.getItem('monitorGUI'));
    // if(txSession != null) {
    //   console.log("txSession=", txSession)
    //   this.monConfServiceObj.setVariableInSession(1);
    //   localStorage.removeItem('monitorGUI');
    // }else if(this._cavLaoutService.getProfileName() != undefined) {
    //   console.log("txSession else part =", txSession)
    //   this.monConfServiceObj.setVariableInSession(2);
    // }



    this.modeStatus = this.dataService.monModeStatus()
    this.profileName = this.monConfServiceObj.getProfileName();
    console.log("profileName = ", this.profileName);
    this.topoName = this.monConfServiceObj.getTopoName();
    console.log("topoName = ", this.topoName);

    if (this.monConfServiceObj.getTierHeaderList() == null)
    {
      this.monConfServiceObj.getDataFromServerTierMonitors().then(data => {
        this.createHeadersList(this.monConfServiceObj.getTierHeaderList());
        this.compData = this.monConfServiceObj.getMonTierTableData();
        console.log("this.compData --",this.compData)
      });
    }
    else {
      console.log("no server communication")
      this.createHeadersList(this.monConfServiceObj.getTierHeaderList());
      this.compData = this.monConfServiceObj.getMonTierTableData();
      console.log("this.compData--",this.compData)
    }
  }

  /***Function used to create header list array for treetable component *****/
  createHeadersList(tierList) {
    if (tierList != null) {
      console.log("tierList--", tierList)
      let that = this;
      tierList.forEach((function (val) {
        that.cols.push({ field: val.id, header: val.name })
      }));
    }
  }

  loadNode(event) {
    console.log("event---", event)
    if (event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      if (event.node.children.length == 0)
        this.monConfServiceObj.getChildNodes(event.node.data.monitor,event.node.data.id);
    }
  }
 
 /**
  * 
  * @param value 
  * @param tierName 
  * @param monitorName 
  */
  onCheckBoxChange(data,tierName)
  {
   console.log("onCheckBoxChange method called--",data)

   /**
    * For updating color of cell as per action performed on checkbox
    */
   let tierVal = data.data[tierName];
   let monName = data.data['monitor'];

   console.log("tierVal--",tierVal)
   

   /***handling case for system monitors */
   if(tierVal['chk'] && data.data['drivenJsonName'] == 'NA')
   {
    this.addEntryForSystemMon(tierName,monName);
   }


   
    /*** handling the following case
     *   in edit case,if the monitor is configured (enabled or disabled) state,there should be data too ,
     *   so that when user enabled or disabled the checkbox,its coloring work as per the code or design
     *   i.e an entry of the same monitor with its respective data in this.monConfServiceObj.saveMonitorData
     *   should be there.
     */  

   if(tierVal['color'] == COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED || tierVal['color'] == COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED || tierVal['color'] == COLOR_CODE.CHECKED_COMPNOPRESENT_ISCONFIGURED||COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED)
   {
     let that = this;
     if (this.monConfServiceObj.saveMonitorData[tierName] == null || (this.monConfServiceObj.saveMonitorData[tierName] != null && this.monConfServiceObj.saveMonitorData[tierName][monName] == null)) 
     {
       this.monConfServiceObj.getMonitorConfiguartion(data.data['drivenJsonName'], monName, tierName).then(obj => {
         this.updateColorAndChkBoxStateArr(monName,tierName,data,tierVal);
     })
    }
    else{
     this.updateColorAndChkBoxStateArr(monName,tierName,data,tierVal);  
    }
   }
  else
    this.updateColorAndChkBoxStateArr(monName,tierName,data,tierVal);

  }



  /**
   * 
   * @param monName 
   * @param tierName 
   * @param data 
   * @param tierVal 
   */


  updateColorAndChkBoxStateArr(monName,tierName,data,tierVal)
  {
   console.log("Method updateColorAndChkBoxStateArr called ")

   /**called to update colorMode and colorName *****/
   this.monConfServiceObj.updateColorModeAndName(data.data,tierName);
   let key = monName + ":"+ tierName;
   this.monConfServiceObj.addUpdateCheckBoxStateArr(tierVal,key);
 }


/**
 * 
 */
 addEntryForSystemMon(tierName,monName)
 {
  console.log("Method addEntryForSystemMon Called check box is selected ")
  let configuredData = this.monConfServiceObj.saveMonitorData;
  /*** handling case when user has selected any server or else it will by default take All Servers ***/
  if(!(configuredData != null && configuredData[tierName] != null &&  configuredData[tierName][monName] != null && configuredData[tierName][monName].length != 0))
  {
   let tableData: TableData[] = [];
   let tableDataObj:TableData;
   tableDataObj = new TableData();
   tableDataObj.appName = "default";
   tableDataObj.options = "";
   tableDataObj.serverName = "All Servers";
   tableDataObj.id = 0;
   tableDataObj.arguments = "";


   console.log("tableDataObj--", tableDataObj)
   tableData.push(tableDataObj);
       
   let obj = { "tier":tierName, "data": tableData, "monName": monName }
   console.log("calling saveConfiguredData method from addEntryForSystemMon Method  ")
   this.monConfServiceObj.saveConfiguredData(obj);
  }
 }

/**
 * 
 * @param monData 
 * @param tierId 
 * @pargetam tierName 
 * @param checkBoxState  = used in next screen as to update colorMode of this particular monitor
 */    
  advanceSettings(monData,tierId,tierName,checkBoxState)
  {
    let currNode = monData["data"];
    let gdfName = currNode["gdfName"];
    let monName = currNode["monitor"];
    let monInfo = currNode["monInfo"];

    if(tierName == "monitor" && monInfo != null)
    {
      try {
        this._dialogFileRef = this._dialog.open(CavMonStatsComponent, {
          data: { name: monInfo, monName:  monName}
        });
  
        this._dialogFileRef.afterClosed().subscribe(result => {
        });
      }
      catch (e) {
        console.error(e);
      }
    }
    else
    {
      console.log("monData--",monName)
      let compData = '';
      let obj = {};
     
      this.monConfServiceObj.setSelectedRow(currNode);

      if(currNode['drivenJsonName'] != null)         
      {
       if(currNode["compArgsJson"] == null )
       {
        let that = this;
        this.monConfServiceObj.getComponentData(currNode['drivenJsonName'],currNode['id']).then(data => {

        console.log("this.monConfServiceObj.saveMonitorData  ",this.monConfServiceObj   + " this.monConfServiceObj.saveMonitorData  =  " , this.monConfServiceObj.saveMonitorData)
 
       if (this.monConfServiceObj.saveMonitorData[tierName] == null || (this.monConfServiceObj.saveMonitorData[tierName] != null && this.monConfServiceObj.saveMonitorData[tierName][monName] == null)) 
       {
         this.monConfServiceObj.getMonitorConfiguartion(currNode['drivenJsonName'], monName, tierName).then(data => {
            this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
         })
       }
       else {
         this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
       }
      })
      }
      else 
      {
       console.log("Component already present so no request to server  ")
       compData = currNode['compArgsJson'];
       obj['data'] = compData,
       obj['id']= currNode["id"] 
       this.monConfServiceObj.setCompArgsData(obj);
       this.store.dispatch({type:"ADD_COMPONENTS_DATA",payload: obj });

       if (this.monConfServiceObj.saveMonitorData == null || this.monConfServiceObj.saveMonitorData[tierName] == null || (this.monConfServiceObj.saveMonitorData[tierName] != null && this.monConfServiceObj.saveMonitorData[tierName][monName] == null)) 
       {
         this.monConfServiceObj.getMonitorConfiguartion(currNode['drivenJsonName'], monName, tierName).then(data => {
            this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
         })
       }
       else {
         this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
       }
      }
    }
    else {

      /****clearing the compArgs obj so that it does not gets rendered in case of non json based monitor****/
       this.monConfServiceObj.setCompArgsData(obj);

      /*** for no json monitor type like checkmonitor,server signature,log parser ***/
      if (this.monConfServiceObj.saveMonitorData == null || this.monConfServiceObj.saveMonitorData[tierName] == null || (this.monConfServiceObj.saveMonitorData[tierName] != null && this.monConfServiceObj.saveMonitorData[tierName][monName] == null)) 
       {
         this.monConfServiceObj.getMonitorConfiguartion(currNode['drivenJsonName'], monName, tierName).then(data => {
            this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
            if (monName == COMPONENT.LOG_PATTERN_MONITOR || monName == COMPONENT.GET_LOG_FILE)
              this.monConfServiceObj.getLogMonGDF(monName);
         })
       }
       else {
         this.router.navigate([URL.MON_CONFIGURATION,this.profileName,this.topoName,monName,tierId,tierName],{ relativeTo: this.route });
       }

     }
    }
  }
 
/**
 * This method used to construct the data send that is used to send to the server
 * Here 
 * configuredData =  {
      "TierName": [
                    {
                      "MQMonitor":[
                             {
                             "serverName": "10.10.50.5",
                              "instanceName": "abc",
                              "enabled": "true",
                              "app": [
                                  {
                                   "appName": "default",
                                   "options": "-m…."
                                 }
                               ]
                            },
                            {

                            }]
  
  * ServerRequiredData as:
                {
   "T1": {"IBMMQStats":
                      {
                      "isEnabled":true,
			                "serverDTOList":[{serverName :"",
			                                  excludeServer :"",
								                        instanceName :"",
								                       isEnable :"true",
								                      appDTOList:[{ appName = "default",options = "",javaHome = "",classPath = ""}]
								                },
								             {
				                     serverName :"",
			                       excludeServer :"",
								             instanceName :"",
								             isEnable :"true",
								            appDTOList:[{ appName = "default",options = "",javaHome = "",classPath = ""}]
								          }								 
								       ]
				      			},						
			 "IBMMQStats2":
			         {
                "isEnabled":true,
			          "serverDTOList":[{
				          serverName :"",
			             excludeServer :"",
								   instanceName :"",
								   isEnable :"true",
								   appDTOList:[{ appName = "default",options = "",javaHome = "",classPath = ""}]
								 },
								 {
				                   serverName :"",
			                       excludeServer :"",
								   instanceName :"",
								   isEnable :"true",
								   appDTOList:[{ appName = "default",options = "",javaHome = "",classPath = ""}]
						          }							 
								]}
		}
							  

}
*/

  saveMonitorsConfigurationData()
  {
   console.log("treeTableData---",this.compData)
   console.log("this.monConfServiceObj.saveMonitorData-",this.monConfServiceObj.saveMonitorData)
   console.log("this.validateMonConfiguredData()--",this.validateMonConfiguredData())
   let validateVal = this.validateMonConfiguredData();
   if(validateVal != null && !validateVal)
   {
     this.messageService.errorMessage("Please configured the enabled monitors first !!!!");
     return;
   }

   let configuredData =  JSON.parse(JSON.stringify(this.monConfServiceObj.saveMonitorData));

   let that = this;
  
   let checkBoxStateArr = this.monConfServiceObj.getChkBoxStateArr();
   console.log("configuredData--",configuredData  + "checkBoxStateArr   ",checkBoxStateArr)

   let newTierData = {};
   
   for (var key in configuredData)
   {
     console.log("configuredData--",configuredData)
     console.log("configuredData[key]--",configuredData[key])
     let monList = configuredData[key];

     /**monList now will be a object ***/
     console.log("monList--",monList)
     

     for (var monName in monList)
     {
     console.log("each--iterating monlist---",monName)
     let serverMonList = [];
     let serverConfList = monList[monName];
     let monType = COMPONENT.STD_MON_TYPE;
     if(monName == COMPONENT.CHECK_MON)
        monType = COMPONENT.CHECK_MON_TYPE;

     else if(monName == COMPONENT.SERVER_SIGNATURE)
        monType = COMPONENT.SERVER_SIGNATURE_TYPE;

     
     else if(monName == COMPONENT.LOG_PATTERN_MONITOR)
        monType = COMPONENT.LOG_PATTERN_TYPE;

     else if(monName == COMPONENT.GET_LOG_FILE)
        monType = COMPONENT.GET_LOG_FILE_TYPE ;
     
     else if(monName == COMPONENT.LOG_DATA_MON)
        monType = COMPONENT.LOG_DATA_MON_TYPE;

     console.log("serverConfList--",serverConfList)

      /*** for json based monitors,data pattern is different */
     let tempObj = {};
     serverConfList.map(function(eachServerConf)
     {
       console.log("eachServerConf----",eachServerConf)
     
       /****Here key = serverName ,enabled ***/
       let key = eachServerConf["serverName"]+ ","+ true + "," +eachServerConf["instance"];
     
       if(!tempObj.hasOwnProperty(key))
           tempObj[key] = [];

        tempObj[key].push(eachServerConf);
       })

      serverMonList = that.createEachConfObject(tempObj); 
      console.log("key---" ,key)

     /**** getting state of monitor at tier level *****/
      let chkBoxStateKey = monName + ":"+ key;   //here key is tierName
      let val = false ;
      for(let i = 0 ; i < checkBoxStateArr.length ; i++)
      {
        if(checkBoxStateArr[i].hasOwnProperty(chkBoxStateKey))
        {
          val = checkBoxStateArr[i][chkBoxStateKey];
        }
      }
      console.log("chkBoxStateKey--",chkBoxStateKey  + "   value  " , val)

      
      let obj = {};
      this.monConfigData = new MonConfigData();
      this.monConfigData.isEnabled = val ;
      this.monConfigData.monType = monType;
      this.monConfigData.serverDTOList = serverMonList;
      // this.monConfigData.logParserGdfData = this.logParserGdfList;

      obj[monName]  = this.monConfigData ;
      
      /***handling case when 2 monitors are configured on same tier  ***/
      if(newTierData[key] != null)
      {
        newTierData[key][monName] = obj[monName];
      }
      else
        newTierData[key] = obj ;
     }
     console.log("newTierData--",newTierData)
   }
   console.log("configuredData------------",newTierData)
   this.sendRequestToServer(newTierData);
  
  }


  validateMonConfiguredData() :boolean
  {
    let checkBoxStateArr = this.monConfServiceObj.getChkBoxStateArr();
    console.log("Methid validateMonConfiguredData ",checkBoxStateArr)
    let flag = checkBoxStateArr.map(function(each)
                {
                 console.log("each--",each)

                 if(each[Object.keys(each)[0]])
                 {
                  console.log("chk colorode---",each['colorMode'] == COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED)
                  if(each['colorMode'] == COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED)
                     return false;
                  else
                    return true;
                 }
                 else
                   return true;
                })

    return flag[0] ;
  }

 /**
  * 
  */
  createEachConfObject(tempObj)
  {
    let serverMonList = [];
    console.log(" this.tempObj--", tempObj )
    console.log("key =  " ,key)
    for(var key in tempObj)
    {
     this.serverConfData =new ServerConfigData();
     let arrValues = key.split(",");

     this.serverConfData.serverName = arrValues[0];
     this.serverConfData.isEnabled = arrValues[1];

     if(arrValues[2] != null && arrValues[2] != "undefined" )
        this.serverConfData[COMPONENT.INSTANCE_NAME] = arrValues[2]

     
     let valueData = tempObj[key];
     console.log("valueData = ",valueData)
     this.serverConfData.gdfDetailsList = valueData[0]["gdfDetails"];
     this.serverConfData.gdfName= valueData[0][COMPONENT.GDF_NAME];
     this.serverConfData.runOptions = valueData[0][COMPONENT.RUN_OPTIONS];
     this.serverConfData.metric = valueData[0][COMPONENT.METRIC];
     let that = this;

     valueData.map(function(each)
     {
      console.log("each = ",each)
      that.serverConfData.monName = each["name"];
      let appObj = {"appName": each["appName"], 
                   "options": each["options"],
                   "javaHome" :each["javaHome"],
                   "classPath":each["classPath"],
                  }

      that.serverConfData.appDTOList.push(appObj);
    })
     serverMonList.push(this.serverConfData);
    }
    return serverMonList;
  }



  /***
   * 
   */
  sendRequestToServer(configuredData)
  {
   console.log("sendRequestToServer method called")
   this.monConfServiceObj.sendRequestToServer(configuredData,this.topoName,this.profileName).subscribe(res =>{ 
     if(res['msg'] != "Success")
    {
      this.messageService.errorMessage(res['msg']);
      return;
    }
    else
      this.messageService.successMessage(this.profileName + " profile has been saved successfully for " + this.topoName  )
   })
  }

  /*** returns tier checkbox value true or false**************/
  getValueOfTierCheckBox(data) 
  {
   return data["monitorState"];
  }


  /**
   * This function is used to update state of the child checkboxes when  
   * its parent node checkbox's state  is changed.
   * @param rowData 
   */

  onTreeNodeCheckBoxChange(rowData)
  {
    let hideShowMonList = this.monConfServiceObj.getHideShowMonList();

    console.log("Method onTreeNodeCheckBoxChange called , rowData = ", rowData  )
    console.log("  hideShowMonLIst = " + hideShowMonList)
    let existingObj;

    if(rowData['children'] != null)
      existingObj = _.find(hideShowMonList,function(each) { return each['category'] == rowData['data'][COMPONENT.MONITOR_NAME]})
    else
      existingObj = _.find(hideShowMonList,function(each) { return each['category'] == rowData['parent']['data'][COMPONENT.MONITOR_NAME]})


    if(rowData['data']['monitorState'])
    {
    /**** For updating its child nodes *****/
    if(rowData['children'] != null)
    {
     console.log(" case of parent node ")

      /***  case of parent node  ****/
      // handling checkbox state
      let childMonList =[];
      rowData['children'].map(function(each) {
       each['data'][COMPONENT.MONITOR_STATE] = rowData.data[COMPONENT.MONITOR_STATE];
         childMonList.push(each['data'][COMPONENT.MONITOR_NAME])
      })

      

      if(existingObj != null) // already category entry is there
      {
       if(!rowData.data[COMPONENT.MONITOR_STATE])
       {
        hideShowMonList = hideShowMonList.filter(function(val){
                             return val['category'] != rowData['data'][COMPONENT.MONITOR_NAME]  //value to be deleted should return false
                       })      
       }
       else
       {
         //case when only few child nodes is selected and then parent node is selected ,i.e all child  node s entry to be done
         existingObj['subCategory'] = childMonList;
       }
      }
      else {
        //case when new entry of parent node is done
       console.log("Case  when new entry of parent node is done ")
       
       this.hideShowMonitorData = new HideShowMonitorData();
       this.hideShowMonitorData.category = rowData['data'][COMPONENT.MONITOR_NAME];
       if(childMonList.length == 0)
           childMonList.push('All')

       this.hideShowMonitorData.subCategory = childMonList;
       hideShowMonList.push(this.hideShowMonitorData);
       }
    }
    else {
      /*** case of selected node is child node  ****/
       console.log(" case of selected node is child node  ")
       
       if(existingObj != null)      // already category entry is there
       {
         let subCateList = existingObj['subCategory'];
         if(rowData.data[COMPONENT.MONITOR_STATE]) { 
           subCateList.push(rowData['data'][COMPONENT.MONITOR_NAME]);
         }
         else {

           /* handling the case when paret node is selected,i.e subcategory = "all"
           * and now on if the child node user does nkit want t o hide so it unselects that node
           */
           if(subCateList.length == 1 && subCateList.indexOf("All") != -1)
           {
             subCateList = [];
             let childList = rowData['parent']['children'];
             childList.map(function(each) {
               let monName = each['data'][COMPONENT.MONITOR_NAME];
               if(monName != rowData['data'][COMPONENT.MONITOR_NAME])
                  subCateList.push(each['data'][COMPONENT.MONITOR_NAME])
             })
           }
           else{
           //case when subacategorylist have no ebtry of 'all'
           subCateList = subCateList.filter(function(val) {
                             return val != rowData['data'][COMPONENT.MONITOR_NAME]  //value to be deleted should return false
                       }) 
           }
           existingObj['subCategory'] = subCateList;
         }
       }
       else {

        this.hideShowMonitorData = new HideShowMonitorData();

        this.hideShowMonitorData.category = rowData['parent']['data'][COMPONENT.MONITOR_NAME];
        this.hideShowMonitorData.subCategory.push(rowData['data'][COMPONENT.MONITOR_NAME]);
        hideShowMonList.push(this.hideShowMonitorData);
       }
     }
    }
    else // when user unselect a checkbox for hide.
    {
     /****case for parent node uncheck */
     if(rowData['children'] != null && (!rowData['data']['monitorState']))
     {
        rowData['children'].map(function(item)
        {
          item['data']['monitorState'] = false;
        })
          existingObj.subCategory = existingObj.subCategory.filter(function(val){return val != existingObj.subCategory})
          hideShowMonList = hideShowMonList.filter(function(val){return val['category'] != existingObj['category'] })
      }

      /* case for child node 
       * when initially parent node is selected, this means all child nodes get selected.
       * This part of the check is used to see if user unselects a checkbox of a child node,
       * then parent node gets unselected
       */
      else 
      {
        if(!rowData['data']['monitorState'] && rowData['parent']['data']['monitorState'])
        {
         rowData['parent']['data']['monitorState'] = false; 
        }

        existingObj.subCategory.map(function(each)
        {
          if(rowData['data']['monitor'] == each)
          {
            existingObj.subCategory = existingObj.subCategory.filter(function(val){return val != each })
          }
        })
      }

    /* when there is no subCategory monitors the remove the category from the hideshowMonList*/
       if(existingObj.subCategory.length == 0)
         hideShowMonList = hideShowMonList.filter(function(val){return val['category'] != existingObj['category']})

    }
    console.log("After all changes ,  hideShowMonitorData = ",hideShowMonList)

    /**** For updating container/holder of hidden Monitors ****/
    this.monConfServiceObj.setHideShowMonList(hideShowMonList);

  }

/**
 * Function called when user wants to hide 
 * the monior from the treeTableData
 */
  hideMonitors()
  {
    let hiddenMonitors = this.monConfServiceObj.getHideShowMonList();
    if(hiddenMonitors.length == 0) // check whether user has selected any monitor to hide or not.
    {
      this.messageService.errorMessage("You have not selected any monitors to hide.Please select the monitor category or the monitor subCategory you want to hide.")
      return
    }
    /*if user has selected the monitors then send request to server for hiding those selected monitors*/
    console.log("Method hideMonitors called , TreeTableData , hideMonList  = ",this.monConfServiceObj.getHideShowMonList())
    this.monConfServiceObj.hideMonitors(this.compData).subscribe(data => {
    this.updateTreeTableData("hide"); 
    this.monConfServiceObj.clearHideShowMonList(); // after request is send to server for hidding the selected monitors then need to clear the hideShowMonList.
   })
    this.messageService.successMessage("You have hidden the monitors successfully.")
  }


/**
 * This function is used  to update Tree Table data when monitors is made to hidden 
 * @param operation 
 */

 updateTreeTableData(operation)
 {
  let hiddenParentNode = [];
  let that = this;
  let hideShowMonList = this.monConfServiceObj.getHideShowMonList();
  console.log("Method updateTreeTableData called ,treeTableData = " ,this.compData  +  " operation = " + operation  + " hideMonList = " + hideShowMonList)
  
  hideShowMonList.map(function(each) {

    let parentNodeObj = _.find(that.compData, function (eachObj) { return eachObj['data'][COMPONENT.MONITOR_NAME] == each['category'] })
    let removeParentNode:boolean = false;
    
    if(parentNodeObj != null && parentNodeObj['children'] != null && parentNodeObj['children'].length == each['subCategory'].length)
       removeParentNode = true;

    if(each['subCategory'].indexOf('All') != -1 || removeParentNode)
    {
      hiddenParentNode.push(each['category'])
    }
    else {
      that.removeSpecificChildNode(each)
    }
  })


 /**removing parent node along with its all child nodes as they are selected  to be hidden */
  this.compData = this.compData.filter(function(each){
    console.log("  each  = ",each)
    console.log("indxOf = ",hiddenParentNode.indexOf(each['data'][COMPONENT.MONITOR_NAME]) == -1)
    return hiddenParentNode.indexOf(each['data'][COMPONENT.MONITOR_NAME]) == -1;
  })

  console.log("after hiding the  monitors treeTableData = " ,this.compData)
}

/**
 * @param obj 
 */
removeSpecificChildNode(obj)
{
 console.log("Method removeSpecificChildNode called , categoryName = " ,obj)
 let node = _.find(this.compData, function (each) { return each['data'][COMPONENT.MONITOR_NAME] == obj['category'] })
 node['children'] = node['children'].filter(function(each){
   return obj['subCategory'].indexOf(each['data'][COMPONENT.MONITOR_NAME]) == -1
 })
}
 
 showHiddenMonitors()
 {
   try 
   {
     console.log("Methhod showHiddenMonitors called ,saveMonitoData = " ,this.monConfServiceObj.saveMonitorData)
     /**
      * This piece of code is done so as to know whether user has 
      * configured any monitor or not
      */
     let arr = Object.keys(this.monConfServiceObj.saveMonitorData)
     let that = this;
    
     if(arr != null && arr.length != 0)
     {
       this.confirmationService.confirm({
        message: 'Do you want to save the configuration done yet ???',
        header: 'Save configured data',
        accept: () => {
          that.saveMonitorsConfigurationData();
          that.openDialogShowMonitor();
        },
        reject: () => {
           that.openDialogShowMonitor();
        }
        });
     }
     else
       this.openDialogShowMonitor();
   }
   catch (e) {
     console.error(e);
   }
 }
  

  /*This method is used to open dialog containing the hidden monitors*/
  openDialogShowMonitor()
  {
 
    console.log("Method openDialogShowMonitor called ", this.monConfServiceObj.getHideShowMonList())
    let that = this;

    /*Check for whether there are any hidden monitors to be shown back in the treetable */
    that.monConfServiceObj.getHiddenMonitorList().subscribe(data =>{
      if(data.length == 0)
      {
        this.messageService.errorMessage("You currently have no monitors hidden.")
        return;
      }

      this._dialogForShowMon = this._dialog.open(CavMonHideShowComponent, {});
  
      this._dialogForShowMon.afterClosed().subscribe(result => {
           console.log("Dialog closed for show monitors UI")

        if(this.monConfServiceObj.isFromAdd) // if this is true then it means that user had added hidden monitors to be shown back i.e. means unhidden monitor.
        {
          that.compData = that.monConfServiceObj.getMonTierTableData(); 
          this.monConfServiceObj.isFromAdd = false;
        } 
      }); 
    })
  }

  /*Method is called when mouse is hovered over the div showing the state of the monitor whether active or inactive*/
  showColorCodeDesc(color)
  {
    if(color == COLOR_CODE.UNCHECKED_COMPNOPRESENT_NOTCONFIGURED || color == COLOR_CODE.UNCHECKED_COMPPRESENT_NOTCONFIGURED || color == COLOR_CODE.PARENT_NODE)
      this.colorCodeInfo = "";

    else if(color == COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED)
      this.colorCodeInfo = COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED_TITLE;

    else if(color == COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED)
      this.colorCodeInfo = COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED_TITLE;

    else if(color == COLOR_CODE.CHECKED_COMPNOPRESENT_NOTCONFIGURED)
      this.colorCodeInfo = COLOR_CODE.CHECKED_COMPNOPRESENT_NOTCONFIGURED_TITLE;
    
    else if(color == COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED)
      this.colorCodeInfo = COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED_TITLE;

    else if(color == COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED)
      this.colorCodeInfo = COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED_TITLE;

    else 
      this.colorCodeInfo = COLOR_CODE.CHECKED_COMPNOPRESENT_ISCONFIGURED_TITLE;

  }

  /*Method called when mouse is hovered over the subcategory monitor after loading the child nodes*/
  childNodeInfo(childNodes)
  {
    if(childNodes['monInfo'] != null)
      this.showTitleForChildNodes = "Click to view monitor stats";
    else
      this.showTitleForChildNodes = "";
  }


  openHealthCheckMonitorDialog()
  {
    let that = this;
    this._dialogForHealthCheckMon = this._dialog.open(CavMonHealthCheckComponent, {});
  
    this._dialogForHealthCheckMon.afterClosed().subscribe(result => {
           console.log("Dialog closed for show monitors UI")

        if(this.monConfServiceObj.isFromAdd) // if this is true then it means that user had added hidden monitors to be shown back i.e. means unhidden monitor.
        {
          that.compData = that.monConfServiceObj.getMonTierTableData(); 
          this.monConfServiceObj.isFromAdd = false;
        } 
      }); 
  }

}
