import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';
import * as URL from '../constants/mon-url-constants';
import { RestApiService } from './rest-api.service';
import { MonDataService } from './mon-data.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import * as _ from "lodash";
import { Store } from '@ngrx/store';
import { ColorCodeData } from '../containers/color-code-data';
import * as COLOR_CODE from '../constants/colorcode-constants';
import { TableData } from '../containers/table-data';
import { MessageService } from './message.service';
import { CavLayoutService } from "../../../main/services/cav-layout-provider.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui'; // Import BlockUI decorator & optional NgBlockUI type
import * as COMPONENT from '../constants/mon-component-constants';
import * as HEADERS_LIST from '../constants/tableheader-constants';
import * as CHECK_MON_DROPDOWN_LIST from '../constants/check-mon-dropdown-constants';
import { UtilityService } from './utility.service';
import { HideShowMonitorData } from '../containers/hide-show-monitor-data';

@Injectable()
export class MonConfigurationService {

  public topoName: string = "mosaic_stress_as1";

  public profileName: string = "test";
  private profileDesc: string = 'NA';

  monTierTreeTableData: any[] = null;

  tierHeaderList: any[] = null;

  /*** hold components array of components ***/
  compArgData: any[];

  /*** Used to hold the configured data of monitor ****/
  saveMonitorData: {};

  /** Used to hold selected row object of treetabledata  ****/
  selectedRow: {} = {};

  /** Used to hold checkBoxState */
  checkBoxStateArr: any[] = [];

  /**** Used to store list of monitors to show or hide *****/
  hideShowMonList:any[] = [];

  hideShowMonData :HideShowMonitorData;


  /* Decorator wires up blockUI instance*/
   @BlockUI() blockUI: NgBlockUI;

   
   /*This variable is used to set category name for monitor*/
   monitorCategory:string;
   
   /*This flag is used for add functionality in show hidden monitor case */
   isFromAdd:boolean = false;

   /*This variable is used to store the list of gdf file names*/
   gdfNameList:any[]=[];

  constructor(private http: Http, private _restApi: RestApiService,
    private monDataService: MonDataService,
    private store: Store<any>,
    private messageService: MessageService,
    private cavLayoutService: CavLayoutService
    
    
  ) {
  }

  handleError;
  getDataFromServerTierMonitors(): Promise<any> {
    this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    let url = this.monDataService.getserviceURL() + URL.GET_TIER_MONITORS_DATA;
    "&userName="+this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();

    let params: URLSearchParams = new URLSearchParams();
    params.set('topoName', this.topoName);
    params.set('jsonName', this.profileName);
    params.set('userName', this.monDataService.getUserName());
    params.set('testRun', this.monDataService.getTestRunNum().toString());
    params.set('monMode', this.monDataService.getMonMode().toString());
    params.set('role',this.monDataService.$userRole);
    params.set('productKey',this.monDataService.getProductKey());

    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        this.blockUI.stop();
        this.tierHeaderList = res["tierList"];
        console.log("Getting from server tierList--", this.tierHeaderList)
        let data = res["treeTableData"]["data"];
        this.modifyDataForColorMode(data);
        this.monTierTreeTableData = data;
      }).
      catch(this.handleError);
  }
  

  
   /**
  *
  * @param calledFrom     this.monConfServiceObj.clearData();
  this.monConfServiceObj.setProfileName(profileName);
  this.monConfServiceObj.setTopoName(selectedTopo);
  */

  public clearSessionVariable() {
    sessionStorage.removeItem('profileName');
    sessionStorage.removeItem('topoName');
    sessionStorage.removeItem('profDesc');
    sessionStorage.removeItem('monMode');
    sessionStorage.removeItem('testRun');
   }

    public restoreVariableFromSession() {

   if(sessionStorage.getItem('profileName') != null) {
       console.log("profileName = " , this.profileName)
       this.profileName = sessionStorage.getItem('profileName').toString();
     }

     if(sessionStorage.getItem('topoName') != null) {
       this.topoName = sessionStorage.getItem('topoName').toString();
     }

     if(sessionStorage.getItem('profDesc') != null) {
       this.profileDesc = sessionStorage.getItem('profDesc').toString();
     }

     if(sessionStorage.getItem('monMode') != null) {
        this.monDataService.setMonMode(Number(sessionStorage.getItem('monMode')));
     }
       if(sessionStorage.getItem('testRun') != null) {
       this.monDataService.setTestRunNum(Number(sessionStorage.getItem('testRun')));
     }
    }

  public setVariableInSession(calledFrom) {
    this.clearSessionVariable();
    console.log("calledFrom = ",  calledFrom)
   if(calledFrom == 0) { // Edit
      console.log("1=")
       sessionStorage.setItem('profileName', this.profileName);
       sessionStorage.setItem('topoName', this.topoName);
       sessionStorage.setItem('profDesc', this.profileDesc);
       sessionStorage.setItem('monMode', this.monDataService.getMonMode().toString())
   }else if(calledFrom == 2) {
    console.log("2 =")
    console.log("this.cavLayoutService.getProfileName()=", this.cavLayoutService.getProfileName())
    sessionStorage.setItem('profileName', this.cavLayoutService.getProfileName());
     sessionStorage.setItem('topoName', this.cavLayoutService.getTopologyName());
   // sessionStorage.setItem('profDesc', this.cavLayoutService.get); need to set the profile description of profile
    sessionStorage.setItem('monMode', this.cavLayoutService.getMonMode().toString());
   } else { // testRun mode

      let txSession = JSON.parse(localStorage.getItem('monitorGUI'));

      if(txSession['monMode'] !== null && txSession['monMode'] !== undefined) {
        sessionStorage.setItem('monMode', txSession['monMode']);
      }
      if(txSession['profileName'] !== null && txSession['profileName'] !== undefined) {
        console.log("txSession['profileName']= ", txSession['profileName'])
          sessionStorage.setItem('profileName',txSession['profileName'] );
        }

      if(txSession['topoName'] !== null && txSession['topoName'] !== undefined) {
            sessionStorage.setItem('topoName',txSession['topoName'] );
      }

      if (txSession['testRunNumber'] !== null && txSession['testRunNumber'] !== undefined) {
        sessionStorage.setItem('testRun', txSession['testRunNumber']);
      }
    }
 }



  /**
   * 
   * @param data 
   */

  modifyDataForColorMode(data) {
    console.log("data  = ", data  + " ColorCodeData = " , ColorCodeData)
    let that = this;
    data.map(function (eachMon) {
      console.log("eachMon--", eachMon)
      let rowObj = eachMon["data"];
      for(var tier in rowObj) {
        let value = rowObj[tier];   //here value = {chk: false, color: -1}
        that.updateColorName(value);
        console.log("rowObj--", rowObj)
      }
    })
  }

  updateColorName(value) {
    if(value != null && value.hasOwnProperty('color'))
      value['colorName'] = ColorCodeData.getColor(value['color']);
  }


  /**** This method sends request to server for getting  *****/
  getChildNodes(categoryName, id) {
    this.monitorCategory = categoryName;// this is used to set the category name 
    this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    console.log("getChildNodes method called--", categoryName + categoryName + ", id = " + id);
    console.log("----------\n befor adding children---", this.monTierTreeTableData[id]);
    let url = this.monDataService.getserviceURL() + URL.GET_CHILD_NODES;


    let params: URLSearchParams = new URLSearchParams();
    params.set('topoName', this.topoName);
    params.set('jsonName', this.profileName);
    params.set('categoryName', categoryName);
    params.set('categoryId', id);
    params.set('userName', this.monDataService.getUserName());
    params.set('testRun', this.monDataService.getTestRunNum().toString());
    params.set('monMode', this.monDataService.getMonMode().toString());
    params.set('role',this.monDataService.$userRole);
    params.set('productKey',this.monDataService.getProductKey());

    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        this.blockUI.stop();
        this.modifyDataForColorMode(res);
        let nodeData = _.find(this.monTierTreeTableData, function (each) { return each['data']['monitor'] == categoryName });
        if(nodeData.data[COMPONENT.MONITOR_STATE])
        {
          let subCateList = [];
          res.map(function(each){
            each.data[COMPONENT.MONITOR_STATE] = nodeData.data[COMPONENT.MONITOR_STATE];
            subCateList.push(each.data['monitor'])
          })
         
         this.hideShowMonList.map(function(each){
           if(each['category'] == 'categoryName')
             each['subCategory'] = subCateList;
         })

        }
        nodeData['children'] = res;
        console.log("----------\n after adding children---", this.monTierTreeTableData);
        console.log("--zzzzz--------\n");
        console.log("getChildNodes method called--", res)
      }).
      catch(this.handleError);
  }

  /**
   * 
   * @param drivenJsonName 
   * @param id 
   */
  getComponentData(drivenJsonName, id): Promise<any> {
    this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    console.log("id--", id)
    let url = this.monDataService.getserviceURL() + URL.GET_COMPONENTS + "?menuDrivenJsonName=" + drivenJsonName + "&userName=netstorm";
    console.log("url----", url)

    let params: URLSearchParams = new URLSearchParams();
    params.set('topoName', this.topoName);
    params.set('jsonName', this.profileName);
    params.set('userName', this.monDataService.getUserName());
    params.set('testRun', this.monDataService.getTestRunNum().toString());
    params.set('monMode', this.monDataService.getMonMode().toString());
    params.set('role',this.monDataService.$userRole);
    params.set('productKey',this.monDataService.getProductKey());

    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        this.blockUI.stop();
        this.addComponentsData(id, res)
        let obj = {};
        obj['data'] = res,
        obj['id'] = id;
        this.setCompArgsData(obj);

        this.store.dispatch({ type: "ADD_COMPONENTS_DATA", payload: obj });
         

      }).
      catch(this.handleError);
  }





  getMonConfiguredData(topoName, jsonName, monName, tierName): Promise<any> {

    this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    let url = this.monDataService.getserviceURL() + URL.GET_MON_CONFIGURED_DATA + 
               "&topoName=" + topoName +
              "?tierName=" + tierName +
               "&jsonName=" + jsonName +
               "&monitorName=" + monName + 
               "&userName="+this.monDataService.getUserName +
               "&role=" + this.monDataService.$userRole + 
               "&productKey=" + this.monDataService.getProductKey();

    console.log("url----", url)

    let params: URLSearchParams = new URLSearchParams();


    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.blockUI.stop();
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        if(res != null || res.length != 0)
           this.addUpdateSaveMonitorDataObj(res, tierName, monName);

      }).
      catch(this.handleError);
  }


  addUpdateSaveMonitorDataObj(configuredData, tierName, monName) {
    console.log("configuredData  ", configuredData)
    console.log("saveMonitorData--", this.saveMonitorData)
    let tableData = [];

    this.modifyDataFromServer(configuredData)
    let obj = { "tier": tierName, "data": tableData, "monName": monName }
    console.log("tableData--", obj)
    this.saveConfiguredData(obj)
  }

  /**
   * 
   */
  modifyDataFromServer(data) {
    console.log("data---", data)
  }



  /**
   * Add compArgsJson to selected node if treetable data
   * @param id  = id of selected row
   * @param data = compArgsJson data i.e components Data  of selected monitor
   */

  addComponentsData(id, data) {
    let arrId = id.split(".");

    /***getting parent  Node if selected node is any of the child node ****/
    let rowData = _.find(this.monTierTreeTableData, function (each) { return each['data']['id'] == arrId[0] });
    console.log("rowData--", rowData)

    if (arrId.length > 1) {
      let childNodes = rowData["children"];
      console.log("childNodes--", childNodes)
      rowData = _.find(childNodes, function (each) { return each['data']['id'] == id });
    }
    rowData["data"]["compArgsJson"] = data;
    console.log("monTierTreeTableData--", this.monTierTreeTableData)
  }



  /**here we are maintaining the state of all checkboxes as changed by the user ***/

  addUpdateCheckBoxStateArr(tierVal, key) {
    console.log("tierVal --", tierVal)
    let isEntryExist: boolean = false;
    let colorMode = tierVal['color'];

    for (let i = 0; i < this.checkBoxStateArr.length; i++) {
      if (Object.keys(this.checkBoxStateArr[i])[0] == key) {
        isEntryExist = true;
        this.checkBoxStateArr[i][key] = tierVal['chk'];
        this.checkBoxStateArr[i]['colorMode'] = colorMode;
        break;
      }
    }

    if (!isEntryExist) {
      let obj = { [key]: tierVal['chk'], 'colorMode': colorMode }
      this.checkBoxStateArr.push(obj)
    }
    console.log("this.checkBoxStateArr--", this.checkBoxStateArr)
  }

  getChkBoxStateArr() {
    return this.checkBoxStateArr;
  }

  setHideShowMonList(data){
    this.hideShowMonList = data;
  }
  
  getHideShowMonList(){
    return this.hideShowMonList;
  }

  setCompArgsData(data) {
    console.log("data--", data)
    this.compArgData = data;
  }

  getTierHeaderList(): any[] {
    return this.tierHeaderList;
  }

  getMonTierTableData(): any[] {
    return this.monTierTreeTableData;
  }

  getTopoName(): string {
    if(this.cavLayoutService.getTopologyName()) {
      this.topoName = this.cavLayoutService.getTopologyName();
    }

    return this.topoName;
  }

  setTopoName(topoName: string) {
    this.topoName = topoName;
  }

  getProfileName(): string {
    if(this.cavLayoutService.getProfileName()) {
      this.profileName = this.cavLayoutService.getProfileName();
    }

    return this.profileName;
    //return "cavisson";
  }

  setProfileName(profileName: string) {
    this.profileName = profileName;
  }

  getProfileDesc(): string {
    return this.profileDesc;
    //return "cavisson";
  }

  setProfileDesc(profileDesc: string) {
    this.profileDesc = profileDesc;
  }


  setSelectedRow(data) {
    this.selectedRow = data;
  }

  getSelectedRow(): object {
    return this.selectedRow;
  }

  clearData() {
    console.log('clearinng monitor service data.');
    this.topoName = 'mosaic_stress_as1';
    this.profileName = 'test';
    this.profileDesc = "NA";
    this.monTierTreeTableData = null;
    this.tierHeaderList = null;
    this.saveMonitorData = {};
    this.compArgData = null;
    this.selectedRow = {};
    this.checkBoxStateArr = [];
    this.monitorCategory = '';
  }


  /**Method to call service to download(import) selected profile  */
  getMprof(topoName, profileName) {
    console.log("topo---", topoName, profileName)
    let url = `${URL.IMPORT_PROFILE}` + "?topoName=" + `${topoName}` + "&profileName=" + `${profileName}` + "&userName="+this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
    console.log("url for download--", url)
    return this._restApi.getDataByGetReq(url);
  }



  /**
   * saveMonitorData = {"tierName1":{ "mon1":[{ tabledata}],
   *                                  "mon2":[{}],
   *                                  "check-monitor":[{}]
   *                                 } ,
   *                     "tierName2":}
   */
  
  saveConfiguredData(data) {

    console.log(" Method saveConfiguredData called", data  + " saveMonitorData  =  " ,this.saveMonitorData) 

    if (this.saveMonitorData != null && this.saveMonitorData[data.tier] != null)
    {
      console.log("existing tier case")
      let isMonObjExist: boolean = false;
      let tierObj = JSON.parse(JSON.stringify(this.saveMonitorData[data.tier]))
      console.log("tierObjList--", tierObj)

      if (tierObj[data.monName] != null) 
      {
          console.log("existing monitor case")
          isMonObjExist = true;
          console.log("data.data--", data.data)
          console.log("data.monName  ", data.monName)
          tierObj[data.monName] = [];
          let arr = data.data;
          arr.map(function (each) {
            tierObj[data.monName].push(each)
          })
         this.saveMonitorData[data.tier][data.monName]= [];
         this.saveMonitorData[data.tier][data.monName]= tierObj[data.monName];
       }

       if (!isMonObjExist && data.data.length != 0) {
         this.saveMonitorData[data.tier][data.monName] = data.data   //new entry of monitor Object
      }
     
      console.log("after break   ", tierObj)
      console.log(" this.saveMonitorData in if cond ", this.saveMonitorData)
    }
    else {
      console.log("new tier entry case")
      if (this.saveMonitorData == null)
        this.saveMonitorData = {};

      if(data.data.length != 0)
      {
       this.saveMonitorData[data.tier] = {};
       this.saveMonitorData[data.tier][data.monName] = data.data ;
      }
    }
    console.log("this.saveMonitorData--", this.saveMonitorData)
  }

  /*** Send Request to Server  ****/
  sendRequestToServer(data, topoName, jsonName) {
    console.log("sendRequestToServer method called--", data)
    let url = this.monDataService.getserviceURL() + URL.SAVE_DATA + "?productKey=" + this.monDataService.getProductKey();

    let params = {
    'topoName': this.topoName,
    'profileName': this.profileName,
    'userName': this.monDataService.getUserName(),
    'testRunNum': this.monDataService.getTestRunNum().toString(),
    'monMode': this.monDataService.getMonMode().toString(),
    'tierMonConf': data,
    'profileDesc':this.profileDesc,
    'role':this.monDataService.$userRole
   };
  
    let dataForServer = { "topoName": topoName, "profileName": jsonName, "tierMonConf": data }
    return this._restApi.getDataByPostReq(url, params)
  }

  /**
   * 
   * @param id Function to get the row from treetabledata on basis of Id
   */
  getSelectedRowOfTreeTableDataById(id) {
    console.log(" id  ", id + " this.monTierTreeTableData  =  ", this.monTierTreeTableData)
    let rowData = _.find(this.monTierTreeTableData, function (each) {
      return each.id == id
    })
    return rowData;
  }


  /**
   *  Function used for updating colorMode and colorName as per operation performed
   * @param data
   * @param checkBoxState 
   * @param tierName 
   */

  updateColorModeAndName(data, tierName) {
    console.log("Method updateColorModeAndName Called   data   = ", data)
    let checkBoxState = data[tierName]['chk'];
    let colorMode = this.getColorMode(data, checkBoxState, tierName)
    console.log("colorMode in  updateColorModeAndName-", colorMode)
    let tierVal = data[tierName];     
    tierVal['color'] = colorMode;
    this.updateColorName(tierVal);
    console.log("data--", data)
    //updating checkboxStateArr used in validation
    let key = data['monitor'] + ":" + tierName;
    this.addUpdateCheckBoxStateArr(tierVal, key);
  }


  /**
   * 
   * @param gdfName 
   * @param username 
   */

  getMonitorsStats(gdfName, username) {
    let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_STATS + "?gdfName=" + gdfName + "&userName="+this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
    console.log(url);
    return this._restApi.getDataByGetReq(url);
  }

  getMonitorsStatsList(gdfNameList) {
    let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_STATS_LIST + "?gdfNameList=" + gdfNameList + "&userName="+this.monDataService.getUserName() + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
    return this._restApi.getDataByGetReq(url);
  }



  /**
   * For edit
   * @param data 
   * @param checkBoxState 
   * @param tierName 
   */

  getMonitorConfiguartion(drivenJsonName, monName, tierName) {
    this.blockUI.start();
    console.log("For Tier = " + tierName + " and for monName", monName + " data is present. " + this.saveMonitorData)


    let url = this.monDataService.getserviceURL() + URL.GET_MONITORS_CONFIG;
    let params: URLSearchParams = new URLSearchParams();
    params.set('topoName', this.topoName);
    params.set('jsonName', this.profileName);
    params.set('menuDrivenJson', drivenJsonName);
    params.set('monitorName', monName);
    params.set('tierName', tierName);
    params.set('userName', this.monDataService.getUserName());
    params.set('testRun', this.monDataService.getTestRunNum().toString());
    params.set('monMode', this.monDataService.getMonMode().toString());
    params.set('role', this.monDataService.$userRole);
    params.set('productKey', this.monDataService.getProductKey());

    let that = this;
    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.blockUI.stop();
        console.log("Method getMonitorConfiguartion() called  , res = ", res);
        if(res != null && res.length != 0)
        {
          let monConfigData: any = {};
          this.modifyTableDataByMonType(res);
          monConfigData[monName] = res;
          this.saveMonitorData[tierName] = monConfigData;
        }
        console.log("this.saveMonitorData ",this.saveMonitorData)
      }).
      catch(this.handleError);
  }

 /**
   *  Here res is the configured mon data 
   *  This method is called so as the value  of options can be 
   *  mapped to fields of respective monitors
   *  @param res 
   */

  modifyTableDataByMonType(res)
  {
    console.log("Method modifyTable DataByMonType called res  = ", res)
    let that = this;
    res.map(function(each)
    {
      if(each['type'] != null && each['type'] != 0 )  // for all monitor except Check Mon, server signature and log monitor
      {
       let valArr = each["options"].split(" "); 
       let hdrList;
       if(each['type'] == COMPONENT.CHECK_MON_TYPE)                             // means monitor is Check Monitor
         hdrList =  HEADERS_LIST.chkMonHdrList;
       else if(each['type'] == COMPONENT.SERVER_SIGNATURE_TYPE)
         hdrList =  HEADERS_LIST.serverSignatureHdrList;
         
       else if(each['type'] == COMPONENT.LOG_PATTERN_TYPE)
       {
         that.modifyLogPatternData(each, valArr);
         return null;
       }
      
      for(let i = 0 ; i <=  hdrList.length - 1; i++ )
      {
        if(i == 0 || hdrList[i].field.includes("_ui"))  // skip the name field and those field which are having  "_ui" appended in the name 
        continue;
       
       if(i <= valArr.length)
       {
        console.log("valArr = ", valArr  + "  i = ", i)

        if(hdrList[i]['isUrlEncode'])
          each[hdrList[i].field] = decodeURIComponent(valArr[i-1]);
        else
          each[hdrList[i].field] = valArr[i-1];
       }
       else 
          each[hdrList[i].field] = "NA";
     }
    }   


      if(each.type == COMPONENT.CHECK_MON_TYPE ) // for check monitor need to get label for displaying in the ui 
      {
        console.log("Method modifyTableDataByMonType called , HEADERS_LIST.chkMonHdrList = ", HEADERS_LIST.chkMonHdrList  + "and each = " , each)
        that.modifyDataForCheckMonDropDown(HEADERS_LIST.chkMonHdrList,each);
      }
    })
    console.log("Method modifyTable DataByMonType called res aftr chenaged  = ", res)
   }

   /* Method is used to get headerList for getting label for each selected option from the dropdown lsit */
   modifyDataForCheckMonDropDown(hdrList,formData)
   {
     console.log("Method modifyDataForCheckMonDropDown called, hdrList = ", hdrList + "and formData = ", formData)
    let that = this;
    hdrList.map(function(eachObj)
    {
      that.getDropDownLabelForCheckMon(formData,eachObj)
   })
  }


 /*this method is called when we have to set the data for the log pattern monitor at the time of edit
 *
 *
  */
  modifyLogPatternData(each, valArr)
  {
    console.log("modifyLogPatternData each  = ", each + "valArr = ",valArr)

    each['fileNameSelection'] =  valArr[0];  //it will hold the file name selection "-f"
    // valArr[1];  //"__journald%20-u+abcd"
    if( valArr[1].startsWith("__journald"))
    {
      each['fileNameSelection'] = "-f __journald";
      if(!valArr[1].includes("-u"))
        each['journalType'] = "all";
      else
      {
        each['journalType'] = "specified";
        let value = decodeURIComponent(valArr[1]);
        console.log(" after decoding value = ",value)
        //"__journald -u abcd"
        let specificJournalValArr = value.split("-u");
        each["specificJournalType"] = specificJournalValArr[1] ;
       
      }
    }
    else
       each['fileName'] = decodeURIComponent(valArr[1]);

    /**** Now valArr[2] it value will be for search Pattern for access Log 
     *    if valArr[2] == "-j" 
     */
    if(valArr[2] != null && valArr[2] == "-j")
    {
      each["enableSearchPattern"] = true;
      each["searchPattern"] = valArr[3];
    }

    console.log("each === after modifying  ",each)
    this.modifyDataForCheckMonDropDown(HEADERS_LIST.logPatternMonList,each);
  }

    
  
  /**
   *  This method is used to get the dropdown label for the corresponding value as selected from the dropdown lisy 
   * @param formData 
   * @param eachObj  = Each  Object of tableheader list
   */
  getDropDownLabelForCheckMon(formData,eachObj)
   {
     console.log("Method getDropDownLabelForCheckMon called  ,formData = " + formData + " and eachObj = ",eachObj )
     if(eachObj.field == COMPONENT.FROM_EVENT || eachObj.field == COMPONENT.FREQUENCY || eachObj.field == COMPONENT.END_EVENT || eachObj.field == COMPONENT.RUN_OPTIONS )
     {
       let key = eachObj.field;
       console.log("key = ", key)
       if(!key.includes("_ui") || formData[key] != '') 
       {
         let list = [];

         if(key == COMPONENT.FROM_EVENT)
            list =  UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_LABEL, CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_VALUE);
         else if(key == COMPONENT.FREQUENCY)
            list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FREQUENYCY_LABEL, CHECK_MON_DROPDOWN_LIST.FREQUENYCY_VALUE);
         else if(key == COMPONENT.END_EVENT)
             list =  UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.END_EVENT_LABEL, CHECK_MON_DROPDOWN_LIST.END_EVENT_VALUE);
        else if(key ==  COMPONENT.RUN_OPTIONS)
             list = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.RUN_OPTION_LABEL, CHECK_MON_DROPDOWN_LIST.RUN_OPTION_VALUE);

          let  obj = _.find(list,function(item){return item.value == formData[key]})
          console.log("obj-------", obj)

          let newKey = key + "_ui";
          
          if(obj.value != 'NA') // skipping those values from the list which have value as NA.when no option is selected from the dropdown it is having value as "NA"
            formData[newKey] = obj.label; // add an entry in the formData when value is not "NA"
          else
          {
            formData[newKey] = obj.value;
          }
            // otherwise set "NA" as its value to be displayed in the ui.
         }
       }
     }
 

  getColorMode(data, checkBoxState, tierName) {

    console.log("Method getColorMode called   data = ", data  + " checkBoxState  =  " ,checkBoxState + "  tierName = " + tierName)
    let monName = data['monitor'];
    if (checkBoxState)                                                      //checked
    {
      console.log("checked ")
      
      if (data['drivenJsonName'] != 'NA')                                   //comp present  
      {
        console.log("this.saveMonitorData--", this.saveMonitorData)
        let monObj = this.saveMonitorData[tierName];
        if (monObj != null && monObj[monName] != null &&  monObj[monName].length != 0)  //case when user fist configured then removve it safer side
        {
         return COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED;
        }
        else {
            return COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED;
         }
       }
      else //case of System monitors which do not require configurations
      {
        return COLOR_CODE.CHECKED_COMPNOPRESENT_NOTCONFIGURED;
      }
    }
     else {
      console.log("checkbox false")
      if (data['drivenJsonName'] != 'NA')                                   //comp present  
      {
        let monObj = this.saveMonitorData[tierName];
        console.log("monObj  ",monObj)
        if (monObj != null && monObj[monName] != null  && monObj[monName].length != 0)  //case when user fist configured then removve it safer side
        {
          return COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED
        }
        else {
           return COLOR_CODE.UNCHECKED_COMPPRESENT_NOTCONFIGURED;
         }
       }
      else //case of System monitors which do not require configurations
      {
        let data = this.saveMonitorData[tierName];
        console.log(" Case of System Monitors , data   = ",data)
        if(data != null && data[monName] != null && data[monName].length != 0)
           return COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED;
        else
           return COLOR_CODE.UNCHECKED_COMPNOPRESENT_NOTCONFIGURED;
      }
    }
  }


   /*Method to send request to the server to start test for a monitor*/
   testMonitor(data, topoName, jsonName, tierName, monName)
   {
     let url = this.monDataService.getserviceURL() + URL.TEST_MONITOR + "?productKey=" + this.monDataService.getProductKey();

     let dataForServer = { "topoName": topoName,
                           "profileName": jsonName, 
                           "userName":this.monDataService.getUserName(), 
                           "tierName": tierName, 
                           "monName": monName,
                           "monConfigDTO": data,
                           "role":this.monDataService.$userRole
                        }

     return this._restApi.getDataByPostReq(url, dataForServer);
  }

 
   
  hideMonitors(monTierTreeTableData)
  {
    console.log("Method  hideMonitors called , hideShowMonList " , this.hideShowMonList)
    let url = this.monDataService.getserviceURL() + URL.HIDE_MONITORS + "?productKey=" + this.monDataService.getProductKey();
    let dataForServer = { 'operation': "hide",
                          'hideShowMonList': this.hideShowMonList,
                          'topoName': this.topoName,
                          'profileName': this.profileName,
                          'userName': this.monDataService.getUserName(),
                          'testRunNum': this.monDataService.getTestRunNum().toString(),
                          'monMode': this.monDataService.getMonMode().toString(),
                            'role':this.monDataService.$userRole
                        };
     console.log("URL = " +  url + ", dataForServer =", dataForServer);                      
    return this._restApi.getDataByPostReq(url,dataForServer)
  }

  getHiddenMonitorList()
  {
    let url = this.monDataService.getserviceURL() + URL.SHOW_HIDDEN_MON+ "?productKey=" + this.monDataService.getProductKey();
    console.log("url ---- ", url)
    return this._restApi.getDataByGetReq(url);
  }

  /*service to show hidden monitors back in the tree table */
  showHiddenMonitors(monTierTreeTableData)
  {
    console.log("Method  showHiddenMonitors called , hideShowMonList = " , this.hideShowMonList)
    let url = this.monDataService.getserviceURL() + URL.HIDE_MONITORS + "?productKey=" + this.monDataService.getProductKey();
    let dataForServer = { 'operation': "show",
                          'hideShowMonList': this.hideShowMonList,
                          'topoName': this.topoName,
                          'profileName': this.profileName,
                          'userName': this.monDataService.getUserName(),
                          'testRunNum': this.monDataService.getTestRunNum().toString(),
                          'monMode': this.monDataService.getMonMode().toString(),
                          'role':this.monDataService.$userRole
                        }; 
     this._restApi.getDataByPostReq(url,dataForServer).subscribe(data => {
        this.monTierTreeTableData = data["treeTableData"]["data"];
        this.messageService.successMessage("You have successfully unhidden the monitor(s)")
     })       
  }

  clearHideShowMonList()
  {
    this.hideShowMonList = [];
  }

  setGDFNameList(data){
    this.gdfNameList = data;
  }
  
  getGDFNameList(){
    return this.gdfNameList;
  }
  
  /*This method is called to get the list of gdf names according to the type of the log monitor*/
  getLogMonGDF(monName) 
  {
    this.blockUI.start();
    let url = this.monDataService.getserviceURL() + URL.GET_GDF_LIST;
    let params: URLSearchParams = new URLSearchParams();
    params.set('monName', monName);
    params.set('productKey', this.monDataService.getProductKey());

    return this.http.get(url, { search: params }).map(res => res.json())
      .toPromise()
      .then(res => {
        this.blockUI.stop();
        this.gdfNameList = res;
      }).
      catch(this.handleError);
  }
  
}
