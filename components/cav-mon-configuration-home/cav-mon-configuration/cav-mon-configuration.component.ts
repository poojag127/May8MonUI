import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import {ConfirmDialogModule, ConfirmationService, SelectItem} from 'primeng/primeng';
//import { ConfigUiUtility } from '../../../utility/monconfig-utility';
import { TableData } from '../../../containers/table-data';
import { ImmutableArray } from '../../../utility/immutable-array';
import * as _ from "lodash";
import {UtilityService} from '../../../services/utility.service';
import {MessageService} from '../../../services/message.service';
import { ROUTING_PATH } from '../../../constants/mon-url-constants';
import * as COMPONENT from '../../../constants/mon-component-constants';
import { MonDataService } from '../../../services/mon-data.service';
import { CavTopPanelNavigationService } from '../../../../../main/services/cav-top-panel-navigation.service';
import { CavConfigService } from '../../../../../main/services/cav-config.service';
import { CheckMonData } from '../../../containers/check-monitor-data';
import * as HEADERS_LIST from '../../../constants/tableheader-constants';
import * as CHECK_MON_DROPDOWN_LIST from '../../../constants/check-mon-dropdown-constants';



@Component({
  selector: 'app-cav-mon-configuration',
  templateUrl: './cav-mon-configuration.component.html',
  styleUrls: ['./cav-mon-configuration.component.css']

})
export class CavMonConfigurationComponent implements OnInit {

   //Here profileId is used for fetching list of xml files
  @Input()
  dependent: number;

  subscription: Subscription;

  subscriptionConfiguredData: Subscription;

  /*It stores selected check monitor data for EDIT/ADD  */
  checkMonFormData:CheckMonData;
  
  tierField:string;

  monName:string;

  topoName:string;

  tierId:number;

  serverList:SelectItem[];

  tableData:TableData[]=[];

  selectedTableData:TableData[];

  formData:TableData;

  isNewConfig:boolean=true;

  /***It holds array of object of component Type ****/
  compArgs:any[]=[];

  tierName:string;

  mjsonName:string;

  dropDownList:SelectItem[]=[];

  configuredUIData:any[];

  /***Used to store clone data *****/
  tempData:any[];

   /***It holds array of server name and corresponding app name  */
   tempArr = [];

  /**Counter for adding id to the tableData */
   count: number = 0;

   /***variable used for holding the state of checkbox */
   checkBoxState:boolean = false;
   
  /** This boolean variable is used to hold the state of the accordion which holds the configured data table
   *  i.e. the second accordion of the configuration screen  
   *  When tableAccordionState is true then the configured Data table accordion is in collapsed state
   *  else it is in expanded state 
   */
  tableAccordionState :boolean =true;

  
  /*This flag is used for disabling the buttons as per mode
   * 0- Edit,
   * 1- View Mode,
   * 2- test run offline mode 
   * 3- run time mode 
   */
  modeStatus: boolean = false;  

  /* this flag is used to display the appname field only in case of kubernetes monitor */
  displayAppNameColumn: boolean = false;

  /*This  variable is used to show the test run number */
  testRunNumber:number;
   
  /*This flag is used to display the dialog box for the generated test run number.
  * When user clicks on test monitor button then on successfull starting of the 
  * test a dialog box is generated showing the test run number to view the webdashboard.
  */
  showdialog:boolean =false;
 
  /*This flag is used to display the java home column in the configured table when type is java home*/
  displayJavaHomeColumn:boolean = false;

   /*This flag is used to display the java class path  column in the configured table when type is java class path*/
  displayClassPathColumn:boolean = false;

  /*This variable is used to show category monitor name to be displayed in the accordion header*/ 
  categoryName:string;

  headerList:any[]=[];
 

 /*** used to hold monitor name  in case of json based monitor and tag name (check-monitor) ..n ol for non json based monitor */
  monitor:string 

  currHdrsList:any[]=[];

/****used to determine type of monitor json based or non json based ****/
  type:number;   

 /* This is used to display accordion header according to monitor type*/
 displayHeader:string;
 
/*This flag is used to display the Instance name column in the configured table when type is instanceName */
  displayInstanceNameColumn:boolean = false;

/** holds the  unique key with combination of serverName,Instance,Name ***/
 uniqueKey:any[] = [];

  constructor( private router:Router,
               private route: ActivatedRoute,              
               private store: Store<any>,
               private monConfigurationService: MonConfigurationService,
               private utilityService:UtilityService,
               private messageService: MessageService,
               private dataService: MonDataService,
               private cavConfigService: CavConfigService,
               private navService: CavTopPanelNavigationService,
               private confirmationService: ConfirmationService
               )
   { }



  ngOnInit() {

    // this.checkMonFormData = new CheckMonData();
    this.categoryName = this.monConfigurationService.monitorCategory;

    this.modeStatus = this.dataService.monModeStatus()
    console.log("this.modeStatus ---" , this.modeStatus)

    console.log("Class CavMonConfiguration loaded changed---")

    this.formData = new TableData();
    this.route.params.subscribe((params: Params) => {
      console.log("params--",params)
      this.topoName = params['topoName'];
      this.tierId = params['tierId'];
      this.monName = params['monName'];
      this.monitor = params['monName'];
      this.tierName = params['tierName'];
      this.mjsonName = params['mjsonName'];
    });


    this.getTableData();

    
    /** getting data of monitor selected ****/
    let compData = this.monConfigurationService.compArgData != null ? this.monConfigurationService.compArgData['data'] : null;
    
    console.log("compData = ",compData)
    let data ;
    if(compData != null)
    {
     data =  JSON.parse (JSON.stringify(compData));

     this.type = COMPONENT.STD_MON_TYPE;

     console.log("data ---",data)

     /*This is used to display the java home and java class path */
     this.displayAppHomeClassPathField(data);
       
     if(data != null &&  Object.keys(data).length != 0)  /***handling case when data ="{}"****/
     {
      this.compArgs = data;
  
      /******making a deep cloning of  data["data"] ,as initial object is used further for clearing the fields ******/
       this.tempData = JSON.parse (JSON.stringify(data)) 
     }

      /*Display header in the accordion along with the category name for each monitor in case of standard monitor*/
      this.displayHeader = this.categoryName + " " + ":" + " " + this.monName + "(Topology: " + this.topoName + ", Monitor Group: " +this.mjsonName + ",  Tier: " + this.tierName + ")" 
    }
    else
    {
      /* Display header in the accordion for check monitor, server signature and log monitor*/
      this.displayHeader = this.monitor + " " +  "(Topology: " + this.topoName + ",  Monitor Group: " +this.mjsonName + ",  Tier: " + this.tierName + ")" ;
      if(this.monitor == COMPONENT.CHECK_MON)
      {
         this.currHdrsList = HEADERS_LIST.chkMonHdrList;
         this.type = COMPONENT.CHECK_MON_TYPE;
      }
      else if(this.monitor == COMPONENT.SERVER_SIGNATURE)
      {
        this.currHdrsList = HEADERS_LIST.serverSignatureHdrList;
        this.type = COMPONENT.SERVER_SIGNATURE_TYPE;
      }
      else if(this.monitor == COMPONENT.LOG_PATTERN_MONITOR )
      {
        this.currHdrsList = HEADERS_LIST.logPatternMonList;
        this.type = COMPONENT.LOG_PATTERN_TYPE;
      }

       this.createHeadersList(this.currHdrsList)
    }
   

     /*** To get the server list in the dropdown ****/
     /*** Here unshift is used to insert element at 0 position of array ****/
     this.utilityService.getServerList(this.tierId)
     .subscribe(data => {
                if(data != null)
                {
                  data["label"].unshift("All Servers");
                  data["value"].unshift("All Servers");
                  this.serverList = UtilityService.createListWithKeyValue(data["label"], data["value"]);
                }
              })
   }


    /***Function used to create xtra headers for table for non json based monitors *****/
   createHeadersList(colList)
   {
     this.headerList = colList;//No of headers to be added to the existing table data headers
     console.log("Method createHeadersList called  ", this.headerList)
   }


   getTableData()
   {
    let data = this.monConfigurationService.saveMonitorData;
    if(data != null  && data.hasOwnProperty(this.tierName))
    {
     let tierObj = data[this.tierName];
     console.log("tierObj   ",tierObj  + "data   ",data)
     if(tierObj[this.monName] != null)
     {
       console.log("existing monitor case")
       this.tableData = tierObj[this.monName];
     }
    }
    console.log("this.tableData--",this.tableData)
   }

  getDataForDependentComp(dependentCompArr, idValObj) {
    let data = [];
    let that = this;
    dependentCompArr.map(function (eachDepenComp) {
        
        
         data.push(that.getDataForComp(eachDepenComp, idValObj));
    })
    console.log("Method getDataForDependentComp caleed value =", data)
    return data;
  }

 
 /**
  * This method is called when user clicks on edit button
  */

   openEditMode(rowData)
   {
     this.formData = new TableData();
     console.log("selectedRowData --", rowData)
     this.formData = Object.assign({}, rowData)
     console.log(" this.formData--", this.formData)
    
     let that = this;
     this.constructData(this.compArgs);
     console.log("this.compArgs--after setting value---",this.compArgs)
     this.tableAccordionState = true;
     this.isNewConfig = false;
   }

 /**
  * 
  */
   constructData(arrData)
   {
     let that = this;
     arrData.map(function(eachComp)
     {
      that.setDataForComponents(eachComp)
     })
   }
     


   
 
 /**
  *  Function called setting value to the components for edit purpose 
  *  @param item 
  */

  setDataForComponents(eachComp)
  {
   let data = this.formData.compValWithId;
   console.log("data in setDataForComponents--", data)

  /*Check for appname type --
   *For kubernetes monitor, this check is valid and it display the field app name 
   *Otherwise for other monitors no app name field is displayed in the gui.In this case, app-name is "default"
   */
  if (eachComp["type"] == "appName")
  {
    eachComp["value"] = this.formData.appName; // assign the value of the appname 
  }

   if(data.hasOwnProperty(eachComp.id)) //skipping  those object whose value is not editable  by the  user (example -radioButton items)
   {
    eachComp["value"] = data[eachComp.id]
    console.log("eachComp component radio buttons--",eachComp)
   }
 
   if(eachComp["type"] == 'Table')
   {
     console.log("dispatching store for table data")
    this.store.dispatch({type:"UPDATE_TABLECOMP_VALUE",payload:{'id':eachComp["id"],'value':eachComp["value"]}})
   }

   if(eachComp.hasOwnProperty("dependentComp") && eachComp["dependentComp"] != null)
      this.constructData(eachComp["dependentComp"]);

   else if(eachComp.hasOwnProperty("items") && eachComp["items"] != null)
      this.constructData(eachComp["items"]);

   else if(eachComp["dropDownList"] != null)
    {
      let that = this;
      eachComp["dropDownList"].map(function(each){
        if(each["dependentComp"] != null)
           that.constructData(each["dependentComp"]);
      })
    }
  }
  
  
  /**
   * This method updates the compArgsJson object for table type as it is custom component and
   * so ngmodel cant be used  and it is called from child comp.
   * @param data 
   */

  updateTableData(data)
  {
   let id = data['id'];
   let arrId = id.split(".");
   console.log("arrId--",arrId)
   let  obj = {} ;
   obj = this.getTableTypeCompObj(this.compArgs,id);
   console.log("obj--",obj)
   obj["value"] = data.data;
   console.log("this.compArgsJSon---",this.compArgs)
  }

  getTableTypeCompObj(compArr,id)
  {
    let obj = {};
    for(let i = 0; i < compArr.length ; i++)
    {
      console.log("id --",compArr[i]['id'])
      if(compArr[i]['id'] == id)
      {
        console.log("id matched condition")
        obj = compArr[i];
        break;
      }
      else if(compArr[i].hasOwnProperty("items") && compArr[i]["items"] != null )
      {
       obj = this.getTableTypeCompObj(compArr[i]["items"],id);
       if(obj != null && Object.keys(obj).length != 0  )
         break;
      }
      else if(compArr[i].hasOwnProperty("dependentComp") && compArr[i]["dependentComp"] != null)
      {
       obj = this.getTableTypeCompObj(compArr[i]["dependentComp"],id)
       if(obj != null && Object.keys(obj).length != 0  )
         break;
      }
    }
    return obj;
  }

/**
 * This function called when table data value not to be constructed as:
 * -f "P:NA,M:NA" ...as ij AccessLog
 * 
 * Here column has its own argumnet and its value has it sown format mentioned in key ="valFormat"
 * Here valFormat can be as
 *  CASE 1   valFormat = "-p NA -p NA"
 *  CASE 2   valFormat = "-C permin,persec"
 *      
 * @param tableData 
 * @param columnData 
 */

  getDataForTableByColumn(tableData ,columnData)
  {
    console.log("Method getDataForTableByColumn called,columnData = " ,columnData)
    console.log(" tableData =  ",tableData)
    let val = '';
    columnData.map(function(each){
      console.log(" each = ",each)
      let valFormat = each[COMPONENT.VAL_FORMAT];
      let arg = each[COMPONENT.ARGUMENT];

      if(valFormat == '')
      {
        /**case when  col are not meant to be included in "options field"
         * For example,in log pattern monitor ,column "Graph Name " is not supposed to 
         * be added to "option field" 
         * So skipping this  column
         **/
        return null;
      }
      let valFormatArr = valFormat.split(" ");
      let count = 0;
      
      for(let i = 0; i < valFormatArr.length ;i++)
      {
        if(valFormatArr[i] == arg)
          count++;
      }

      if(count == 1)
      {
       /*** it means valFormat = "-C perMin,perSec" ***/
       val = val + arg + COMPONENT.SPACE_SEPARATOR;
       for(let j = 0; j < tableData.length; j++)
       {
         val = val + tableData[j][arg] + ","
       }
       console.log("val = ",val)
       val = val.substring(0,val.length - 1)
      }
      else
      {
       /** it means valFormat = "-p NA -p NA" ***/
       for(let k = 0; k < tableData.length; k++)
       {
        val = val + arg + COMPONENT.SPACE_SEPARATOR + tableData[k][arg] + COMPONENT.SPACE_SEPARATOR;
       }
      }
    })
    console.log("Method getDataForTableByColumn called aftr created data",val) 
   return val.trim();
  }
 
 /**
  * Getting data for table component and modifying it
  * as per the cases:
  *
  * @param tableData 
  */
  getDataForTable(tableData)
   {
    let val='';
    tableData.map(function(each) {
      console.log("each---",each)
      for (let key of Object.keys(each))
      {
        if(key != "id" && !key.startsWith("ui-"))
           val = val + key + ":" + each[key]+ ",";
      }
    })
    val = val.substring(0, val.length-1);
    console.log("Methd getDataForTable called value = ",val.trim())
    return val.trim();
  }

  /**
   * Generic function to get the value of each component
   * @param eachCompData 
   */

   getDataForComp(eachCompData, idValObj)
   {
    console.log("Method getDataForComp called for Component =  ", eachCompData)
    let data = '';
    let argumentData = '';
    idValObj[eachCompData['id']] = eachCompData.value;

     if (eachCompData[COMPONENT.TYPE] == COMPONENT.FIELDSET_TYPE) 
     {
      let val = "";
      let label = eachCompData[COMPONENT.LABEL];
      let argsVal = eachCompData[COMPONENT.VALUE].split(",");
      console.log("Jyoti argsVal =  ", argsVal)

      if (eachCompData[COMPONENT.DEPENDENT_COMP] != null)
      {
        let depComp = eachCompData[COMPONENT.DEPENDENT_COMP];
        let depData = this.getDataForDependentComp(eachCompData[COMPONENT.DEPENDENT_COMP], idValObj);
 
        console.log("Jyoti depData =  ", depData)

        label = label + "=";

        let depLabel = "";
        let depVal = "";

        console.log("Dependengt Comp Value  = " + depData)
        for (let i = 0; i < depData.length; i++) 
        {
          console.log("argsVal ",argsVal)
          if (argsVal.length > 1) 
          {
            let opt = (depData[i][COMPONENT.OPTION_KEY]).trim();
            console.log("opt for radio button = ",opt)
            if(opt != '')
              argsVal[i] = argsVal[i].replace("NA", opt);
          }
          else
          {
            depVal = depVal + COMPONENT.SPACE_SEPARATOR + (depData[i][COMPONENT.OPTION_KEY]).trim();
            depLabel = depLabel + (depData[i][COMPONENT.ARGDATA_KEY]).trim() + COMPONENT.SPACE_SEPARATOR;
          }
        }
        if (argsVal.length > 1) 
        {
         depLabel = argsVal
         depVal = eachCompData[COMPONENT.ARGUMENT] + COMPONENT.SPACE_SEPARATOR + argsVal;
        }

        data = depVal;
        argumentData = label + depLabel;
        console.log("Field set, Value = " + data + ", \nlabel = " + argumentData);
      }
    }
    else if(eachCompData[COMPONENT.TYPE] == COMPONENT.ACCORDION_TYPE)
    {
      let depComp = eachCompData[COMPONENT.DEPENDENT_COMP];
      let depData = this.getDataForDependentComp(eachCompData[COMPONENT.DEPENDENT_COMP], idValObj);
      let val = '';
      let label = eachCompData[COMPONENT.LABEL];
      for (let i = 0; i < depData.length; i++)
      {
        console.log("depData[i] for accordion = ", depData[i])
        val = val + COMPONENT.SPACE_SEPARATOR + depData[i][COMPONENT.OPTION_KEY];
        label = label + COMPONENT.VIEW_SEPARATOR + depData[i][COMPONENT.ARGDATA_KEY];
      }
      data = val;
      argumentData = label;
      console.log("Method getDataForComp For Accordion type = "+data  + "argumentData "+ argumentData)
    }

    /***for drop down  ********/
    else if(eachCompData[COMPONENT.TYPE] == COMPONENT.DROPDOWN_TYPE)
    { 
      /** 
       * case 1:if parent comp han argument and any of the dependent components contains any argumnets 
       * then it will be as:
       *  argOfDropdown valOfDropdown  argOfDependentComponent valOfdependentComp
       * Example:
       *
       * case 2:if parent comp does not contain any argumnet,
       * and its selcted option's dependent comp has argumnets ,then 
       * its value will be wriiten:
       * argOfSelectedOption's dependentComp  valueOfSelectedOption's DependentsCompnent[]  
       * Ex:see log parser 
       * 
       * 
       * case 3:
       */

      let selectedObj = _.find(eachCompData[COMPONENT.DROPDOWN_LIST], function (each) { return each.value == eachCompData.value })
      console.log("In case of dropdown selected value  object = ",selectedObj)
      
      let value = eachCompData.value;
      let label = eachCompData[COMPONENT.LABEL] + COMPONENT.VIEW_SEPARATOR + eachCompData[COMPONENT.VALUE] ;

      let val ='';
      if(eachCompData[COMPONENT.ARGUMENT] != '')
        val =  eachCompData[COMPONENT.ARGUMENT] +COMPONENT.SPACE_SEPARATOR ;
          
      if(selectedObj[COMPONENT.DEPENDENT_COMP] != null)
      {
       let dependComp = selectedObj[COMPONENT.DEPENDENT_COMP];
       
       let isContainsArg :boolean;
       for(let i = 0; i < dependComp.length; i++)
       {
         if(dependComp[i][COMPONENT.ARGUMENT] != '')
         {
            isContainsArg = true;
            break;
         }
       }

       let data = this.getDataForDependentComp(dependComp,idValObj)   
       console.log("label = ",label)
      

       if(isContainsArg)
       {
         if(eachCompData[COMPONENT.ARGUMENT] != '')
           val = val + eachCompData.value + COMPONENT.SPACE_SEPARATOR;
       }

        for (let i = 0; i < data.length; i++) {
          val = val  + data[i][COMPONENT.OPTION_KEY];
          label = label + "," + data[i][COMPONENT.ARGDATA_KEY];
        }
      }
      else
      {
        /***value when no dependComp is there ***/
        val = val + eachCompData.value;
      }

       data = val;
       argumentData = label;
       console.log("For dropdown final data constructed  data = " ,data   + "  argumentData  " ,argumentData)
    }
    /*** for radio buttons ***/
    else if (eachCompData[COMPONENT.RADIO_ITEM] != null)
     {
      /**  getting the object of selected radio   ****/
      let selectedObj = _.find(eachCompData[COMPONENT.RADIO_ITEM], function (each) { return each.value == eachCompData.value })

      let val = null;
      let label = selectedObj.label;
      //If dependent component is present
      if (selectedObj[COMPONENT.DEPENDENT_COMP] != null) {
        let depComp = selectedObj[COMPONENT.DEPENDENT_COMP];
        val = this.getDataForDependentComp(selectedObj[COMPONENT.DEPENDENT_COMP], idValObj);
      }

      //only radio button is there
      if (val == null) 
      {
        if (selectedObj[COMPONENT.ARGUMENT] != null && selectedObj[COMPONENT.ARGUMENT] != "") {
          val = selectedObj[COMPONENT.ARGUMENT] + COMPONENT.SPACE_SEPARATOR + selectedObj[COMPONENT.VALUE]
        }
        else if (selectedObj[COMPONENT.VALUE] != null) {
          val = selectedObj[COMPONENT.VALUE];
        }
        label = label + COMPONENT.VIEW_SEPARATOR + selectedObj[COMPONENT.VALUE];
      }
      else {
        let data = val;
        label = label + " ";
        val = selectedObj[COMPONENT.ARGUMENT];

        for (let i = 0; i < data.length; i++) {
          val = val + COMPONENT.SPACE_SEPARATOR + data[i][COMPONENT.OPTION_KEY];
          label = label + COMPONENT.VIEW_SEPARATOR + data[i][COMPONENT.ARGDATA_KEY];
        }
      }
      data = val;
      argumentData = label;
      console.log("Radio : val= ", val + "\nLabel = " + label);
    }
    else if (eachCompData[COMPONENT.TABLE_COLUMN_DATA] != null && eachCompData[COMPONENT.VALUE] != null &&  eachCompData[COMPONENT.VALUE] != '') 
    {
      let val = "";
      if(eachCompData[COMPONENT.ARGUMENT] != '')
      {
        data = data + " " + eachCompData.arg;
        val = this.getDataForTable(eachCompData.value);
      }
      else
      {
        val = this.getDataForTableByColumn(eachCompData.value,eachCompData[COMPONENT.TABLE_COLUMN_DATA])
      }
      data = data + " " + val;
      argumentData = argumentData + eachCompData.label + ":" + val;
      console.log("data for tableData--", data)
    }
    else if (eachCompData[COMPONENT.TYPE] == COMPONENT.CHECKBOX_TYPE)
    {
      if (eachCompData[COMPONENT.VALUE]) 
      {
        data = eachCompData[COMPONENT.ARGUMENT];
        argumentData = eachCompData[COMPONENT.LABEL] + ":" + eachCompData[COMPONENT.VALUE];

         //If dependent component is present
        let val = null ;
        let label = eachCompData[COMPONENT.LABEL] ;
        if (eachCompData[COMPONENT.DEPENDENT_COMP] != null) {
         let depComp = eachCompData[COMPONENT.DEPENDENT_COMP];
         val = this.getDataForDependentComp(eachCompData[COMPONENT.DEPENDENT_COMP], idValObj);
       } 

       console.log("Dependenet Component value for CheckBox type = " ,val)

         //only radio button is there
       if (val == null) 
       {
         if (eachCompData[COMPONENT.ARGUMENT] != null && eachCompData[COMPONENT.ARGUMENT] != "") {
          val = eachCompData[COMPONENT.ARGUMENT] 
        }
        
        label = label + COMPONENT.VIEW_SEPARATOR + eachCompData[COMPONENT.VALUE];
       }
      else {
        let data = val;
        label = label + " ";
        val = eachCompData[COMPONENT.ARGUMENT];

        for (let i = 0; i < data.length; i++) {
          if(data[i][COMPONENT.OPTION_KEY] != '')
          {
           val = val + COMPONENT.SPACE_SEPARATOR + data[i][COMPONENT.OPTION_KEY];
           label = label + COMPONENT.VIEW_SEPARATOR + data[i][COMPONENT.ARGDATA_KEY];
          }
        }
      }
       
       data = val;
       argumentData = label;
       console.log("CheckBox  : val= ", val + "\nLabel = " + label);
      }
    }
    else 
    {
       console.log("textfield condition eachCompData  ",eachCompData)
       let value = eachCompData[COMPONENT.VALUE];
       console.log("value  = ",value)

       if(value == null || value == '')
          value = eachCompData[COMPONENT.DEFAULT_VALUE];

       console.log("value for dependentCop ",value)
      
       if(value != '') //case when user has not entered any value  and the component does  not have any default value
       {
        console.log("value " ,value)
        if(eachCompData[COMPONENT.VALIDATION_OBJ][COMPONENT.INPUT_TYPE] != "password")// case when we get input type as "password" we skip that field and do not show in the argument data(i.e in gui) but send it to the server.
        {
        if (eachCompData[COMPONENT.ARGUMENT] != null && eachCompData[COMPONENT.ARGUMENT] != "")
        {
         if (eachCompData[COMPONENT.LABEL] != "")
           argumentData = eachCompData[COMPONENT.LABEL] + COMPONENT.VIEW_SEPARATOR;
  
         argumentData = argumentData + value;

         if(eachCompData[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
          data = data + COMPONENT.SPACE_SEPARATOR + eachCompData[COMPONENT.ARGUMENT] + COMPONENT.SPACE_SEPARATOR + encodeURIComponent(value);
         else
          data = data + COMPONENT.SPACE_SEPARATOR + eachCompData[COMPONENT.ARGUMENT] + COMPONENT.SPACE_SEPARATOR + value;
        
        }
        else 
        {
         argumentData = value;
         if(eachCompData[COMPONENT.VALIDATION_OBJ][COMPONENT.URL_ENCODE])
           data = data + COMPONENT.SPACE_SEPARATOR + encodeURIComponent(value);
         else 
           data = data + COMPONENT.SPACE_SEPARATOR + value;
        }
      }
      else // case when inputType is password and we add that field value to the "options"
      {
        data = eachCompData[COMPONENT.ARGUMENT] + COMPONENT.SPACE_SEPARATOR + COMPONENT.PASSWORD_SEPERATOR +value+COMPONENT.PASSWORD_SEPERATOR;
        console.log("options created for inputType as password--" , data)
      }    
    }
  }
    console.log("data---", data)
    console.log("argumentData---", argumentData)
    return {"options": data, "argumentData": argumentData };
  }



  chkDuplicateEntry(operation,msg,id)
  {
    let key = this.formData.serverName + this.formData.name 
    if(this.type == COMPONENT.SERVER_SIGNATURE_TYPE)
       key = key + this.formData[COMPONENT.SIGN_TYPE];
    else if(this.type == COMPONENT.CHECK_MON_TYPE || this.type == COMPONENT.LOG_PATTERN_TYPE)
       key = key + this.formData.instance;
  
    
   if(this.uniqueKey.length != 0)
   {
     if(this.uniqueKey.indexOf(key) == -1 )
       this.uniqueKey.push(key);
     else
     {
       if(operation == "edit")
       {
         /**
          * This is to handle the case when user edit the selected row but he does not change the serverName,
          * instanceName and logMonName,it should be allowed and at the same time,if user changes any of these
          * same validation i.e concept of uniqueness rule must be applied.
          */
         let selectedRowObj = _.find(this.tableData, function(each) { return each['id'] == id});
         let selectedRowKey = selectedRowObj.serverName + selectedRowObj.name + selectedRowObj.instance;
         if(key == selectedRowKey)
          return true;
       }
      this.messageService.errorMessage(msg);
      return false;
     }
   }
   else
      this.uniqueKey.push(key);
    
  return true;
  }


/**
 * This method is called when add button is clicked 
 * This method forms the data for the table 
 */

 addData()
 {
   console.log("compArgs--",this.compArgs)
   console.log("selectedTableDta-",this.formData)

   console.log("checkMon data = ",this.checkMonFormData)
   let option = '';         // for data to sent to the server (for file writing)
   let argumentData = '';  // for  column to be displayed to user as (label1:data1,label2:data2)
   let arg = '';
   let valIdObj = {};   

    /*** Check for whether selected monitor is configured for all tier or specific tier **/
    if(this.tierId == -1)
    {
      this.formData.serverName = 'All Server';
      this.messageService.successMessage(this.monName + " has been configured for All Servers");
    }
    else
    {
       if(this.formData.serverName == "" || this.formData.serverName == undefined)
       {
          this.messageService.errorMessage("Please select server ");
          return;
       }
     this.messageService.successMessage(this.monName + " has been configured for " + this.formData.serverName)
    }
    
    
   let that = this;

   console.log("this.type = ",this.type)
   
   if(this.type != COMPONENT.STD_MON_TYPE) //i.e it is non json based monitor
   {
    if (this.type == COMPONENT.CHECK_MON_TYPE)  // Checking for eihter Check Monitor or Server Signature
    {
      let msg = "This combination of Server Name ,Check Mon Name , Instance Name already exists"
      if (this.validateCheckMon(this.formData)) 
      {
        if (this.isNewConfig) 
        {
          if(!this.chkDuplicateEntry("add",msg,"-1"))     //checking duplicate entry when adding 
          return ;
        }
        else {
          if(!this.chkDuplicateEntry("edit",msg,this.formData.id))     //checking duplicate entry when editing
          return ;
        }
      }
      else   //case when validation fails and user is not allowd to make entry thus returning it.
        return false;
    }
    else if(this.type == COMPONENT.SERVER_SIGNATURE_TYPE){
      //case of server signature
      let msg = "This combination of server Name, Server Signature Name and Signature Type already exists";
      if (this.validateServerSign(this.formData))
       {
        if (this.isNewConfig)
         {
          if(!this.chkDuplicateEntry("add",msg,"-1"))   //checking duplicate entry when adding
             return ;
        }
        else {
          if(!this.chkDuplicateEntry("edit",msg,this.formData.id))    //checking duplicate entry when editing
             return ;
        }
      }
      else     //case when validation fails and user is not allowd to make entry thus returning it.
        return false;
    }
    else if(this.type == COMPONENT.LOG_PATTERN_TYPE)
    {
      let msg = "This combination of server name, log monitor name and instance name already exists";
      if (this.validateLogPatternMon(this.formData))
       {
        if (this.isNewConfig)
         {
          if(!this.chkDuplicateEntry("add",msg,"-1"))   //checking duplicate entry when adding
             return ;
        }
        else {
          if(!this.chkDuplicateEntry("edit",msg,this.formData.id))    //checking duplicate entry when editing
             return ;
        }
      }
      else     //case when validation fails and user is not allowd to make entry thus returning it.
        return false;
    }
    // else if(this.type == COMPONENT.LOG_PATTERN_TYPE)
    // {
    //   if (this.validateLogPatternMon(this.formData))
    //   {
    //     if (this.isNewConfig)
    //     {
    //      if(this.validateAppNameAndServerName(this.formData.name, this.formData.serverName  ,this.formData.instance ))
    //      {
    //       this.messageService.errorMessage("This combination of server name, log monitor name and instance name already exists");
    //       return;
    //      }
    //     }
    
    //   }
    //   else     //case when validation fails and user is not allowd to make entry thus returning it.
    //     return false;
    // }
    option = this.createDataForNonJsonMon(this.formData);
    console.log("option for non json based monitor = ",option)
    if(this.formData.metric == "Custom Metrics")
       this.formData.metric = this.formData.customMetricName;

    /*If search pattern for access log is not enabled then push NA in the table*/
    if(!this.formData.enableSearchPattern)
        this.formData.searchPattern = "NA";

    /*If file selection type is "Use JournalD" and "all" is selected the push "JournalD" in the table*/     
    if(this.formData.journalType == "all")
    this.formData.fileName = "JournalD";
 

  }
   else 
   {
    this.compArgs.map(function(each)
    {
     console.log("each  " ,each)

     /* here we check for two cases before adding it to argument field in the table:-
      * case 1: if type is fieldset then we need not check whether it is having a value or not.
      * case 2: For type other than fieldset we check whether the component is having a value or not beforing adding data .
      */
     let bool = each.type == COMPONENT.FIELDSET_TYPE ||each.type == COMPONENT.ACCORDION_TYPE? true : each.value != null && each.value != '';
     if(bool)   //skipping the field which is not mandatory and user has not filled 
     {
       if(each.type == COMPONENT.APP_NAME)
       { 
         if(each.value != null && each.value != '')
           that.formData.appName = each.value; // assign value for the app name in the form 
           valIdObj[each['id']] = each.value;
       }
       else if(each.type  == COMPONENT.INSTANCE_NAME)
       {
        if(each.value != null && each.value != '')
           that.formData.instance = each.value; // assign value for the instance name in the form 
           valIdObj[each['id']] = each.value;
       }
       else if(each.type == COMPONENT.JAVA_HOME)
       {
         that.formData.javaHome = each.value;
         valIdObj[each['id']] = each.value;
       }
       else if(each.type == COMPONENT.CLASS_PATH)
       {
         that.formData.classPath = each.value;
         valIdObj[each['id']] = each.value;
       }
      
       else
       {
         let values = that.getDataForComp(each,valIdObj);
         if(values["options"] != '') 
         {
          option = option + " " + values["options"];

          /*Check for not adding password field in the argument data*/
          if(each[COMPONENT.VALIDATION_OBJ][COMPONENT.INPUT_TYPE] != "password")
            argumentData = argumentData + "  " + values["argumentData"] + ","
         }
       }
     }
   })
   //done substring to {argumentData} to  remove comma appeneded at the last of the string
    this.formData.compValWithId = valIdObj;
   }
   this.formData.arguments = argumentData.substring(0,argumentData.length -1) 
   this.formData.options = option 

   console.log("this.formData =  ",this.formData)

   if(this.isNewConfig)
   {
     /* This check is for the mandatory dropdown.
     * If a dropdown is mandatory then it must be selected and cannot be left blank before submit 
     */
    if(!this.validateRequiredField())
      return;

    // if(this.type == COMPONENT.LOG_PATTERN_TYPE && !this.validateLogPatternMon(this.formData))
    //   return;


     /* This check is used only in case of the kubernetes monitor where we have app name as separate field.
      * So for that case we need to check whether there is key for the following 
      * app name and server name existing or not
      */
    if(this.type == COMPONENT.STD_MON_TYPE && this.validateAppNameAndServerName(this.formData.appName, this.formData.serverName  ,this.formData.instance ))
    { 
      if(this.formData.appName == undefined)
      {
        this.messageService.errorMessage("Duplicate server entry")
        return;
      }
      else
      {
        this.messageService.errorMessage("Following combination of server name and app name already exists.Please enter different server name or app name")
        return;
       }
     }


    this.formData.id = this.count;

    console.log("this.formData after updating key--", this.formData)
     //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
    this.tableData=ImmutableArray.push(this.tableData, this.formData);
    this.count = this.count + 1;
   }
   else {
     //for edit functionality TO DO 
    if (this.type == COMPONENT.CHECK_MON_TYPE) 
    {
      if (this.validateCheckMon(this.formData))
      {
        this.updateConfiguration();
      }
      else
        return false;
    } 
    else if(this.type ==COMPONENT.SERVER_SIGNATURE_TYPE)
     {
      if (this.validateServerSign(this.formData)) 
      {
        this.updateConfiguration();
      }
       else
        return false;
    }
    else if(this.type ==COMPONENT.LOG_PATTERN_TYPE)
    {
     if (this.validateLogPatternMon(this.formData)) 
     {
       this.updateConfiguration();
     }
      else
       return false;
   }
    else // edit case for standard monitor.
    {
      this.updateConfiguration();
    }           
   }

   console.log("this.tableData after performing add/Edit Opertaion--",this.tableData)
   
   this.clearFormFields();

   /**This is used to change the state of the Configured Data accordion from collapsed to expanded 
    * to show the configured data table when data is configured for the selected monitor.
    */
    this.tableAccordionState = false;
 }

 /*This method is used to check whether dropdown is mandatory or not.
  *If dropdown is mandatory then it cannot be left unselected.
  *On leaving a mandatory dropdown unselected user must get a prompt to select the dropdown.
  */ 
  validateRequiredField():boolean
  {
    console.log("Method validateRequiredField() called " )
    let that = this;

    for(let i = 0 ; i<this.compArgs.length ; i++)
    {
     if(this.compArgs[i][COMPONENT.TYPE] == [COMPONENT.DROPDOWN_TYPE])
     {
      if(this.compArgs[i][COMPONENT.VALIDATION_OBJ][COMPONENT.REQUIRED] && this.compArgs[i][COMPONENT.VALUE] == '')
      {
        that.messageService.errorMessage("Please select " + this.compArgs[i][COMPONENT.LABEL] + " as it is a mandatory field");
        return false;
      }
     }
    }

    return true;
  }

  validateLogPatternMon(formdata: TableData) :boolean
  {
    if (formdata['gdfDetails'].length == 0)
    {
      this.messageService.errorMessage(" Please enter atleast details for one graph.")
      return false;
    }
    return true;
  }
 

 /*This is a common method used to update configuration on edit */
 updateConfiguration()
 {
  this.tableData = ImmutableArray.replace(this.tableData, this.formData, this.getSelectedRowIndex(this.formData["id"]))
  this.isNewConfig = true; // to change the form button from UPDATE -> ADD when update is already done.
  this.messageService.successMessage("Configuration for " + this.monName + " has been updated successfully");
  this.selectedTableData = [];
 }


   //validation for server signature
   validateServerSign(formdata: TableData): boolean {

    console.log("validatesign", formdata);
    if (formdata['signType'] == null || formdata['signType'] == undefined) {
      this.messageService.errorMessage("Please Select Signature Type");
      return false;
    }
    return true;
  }


  //validation for check monitor
  validateCheckMon(formdata: TableData): boolean {

    console.log("formdata from innside validateCheckMon", formdata);
    if (formdata.fromEvent == "NA") 
    {
      this.messageService.errorMessage("Please Select From Event ");
      return false;
    } 
    else if (formdata.fromEvent == "2" || formdata.fromEvent == "3") 
    {
      if (formdata.fromEvent == "3" && (formdata.endEvent == "3" && formdata.phaseName == "NA" || formdata.phaseName == ""))
       {
        this.messageService.errorMessage("Please Enter Valid Phase Name ");
        return false;
      } 
      else if (formdata.phaseName != "NA" || formdata.fromEvent == "2") 
      {
        if (formdata.frequency == "NA") 
        {
          this.messageService.errorMessage("Please Select Frequency ");
          return false;
        }
         else if (formdata.frequency == "2") 
         {
          if (formdata.endEvent == "NA") 
          {
            this.messageService.errorMessage("Please Select End Event ");
            return false;
          } 
          else if (formdata.endEvent == "3")
          {
            if (formdata.endPhaseName == "NA" || formdata.endPhaseName == '' || formdata.endPhaseName == null) 
            {
              this.messageService.errorMessage("Please Enter Valid Count ");
              return false;
            }
          } 
          else if (formdata.endEvent == "2") 
          {
            if (formdata.count == "NA" || formdata.count == null) {
              this.messageService.errorMessage("Please Enter Valid Count ");
              return false;
            }
          }
        }
      }
    }


    //if frequency is not selected while editing then it sets periodicity,count,endPhasename to NA
    if (formdata.frequency == "1") {
      formdata.periodicity = "NA";
      formdata.count = "NA";
      formdata.endPhaseName = "NA";
    }

    //if endevent is changed while editing then values of count or endphasename is set to NA
    if(formdata.frequency == "2"){
      if(formdata.endEvent == "1")
      {
        formdata.count = "NA";
        formdata.endPhaseName = "NA";
      }else if(formdata.endEvent == "2")
      {
        formdata.endPhaseName = "NA";
      }else if(formdata.endEvent == "3")
      {
        formdata.count = "NA";
      }
    }

    return true;
  }
 
/**
 * -f "%2Fpath"  -C PerMin,PerSec  -i 90  -j seaqrchVheckbox -p "searchForgraph" -p "seacrch+forGraph2"
 * @param formData 
 */

 createOptionsForLogPatternMonitor(formData)
 {
  let val = '';
  let argumentData = '';
  val =  val + formData.fileNameSelection + COMPONENT.SPACE_SEPARATOR ;

  let textForFileName = '';

  /** -f "__journald%3A-u+specifiueJournanlD+" */
  if(formData.fileNameSelection == "-f __journald" && formData.journalType == "-u")
   textForFileName = formData.journalType + COMPONENT.SPACE_SEPARATOR + formData.specificJournalType;
  else
   textForFileName = formData.fileName;

   console.log("textForFileName=", textForFileName)
   if(textForFileName != null && textForFileName != '')
   {
      val = val + encodeURIComponent(textForFileName) +COMPONENT.SPACE_SEPARATOR ;
      console.log("val = ",val)
   }

   if(formData.enableSearchPattern)
   {
     val = val + "-j" + COMPONENT.SPACE_SEPARATOR +formData.searchPattern + COMPONENT.SPACE_SEPARATOR;
   }
  
  let gdfDetails = formData.gdfDetails;
  let unitData = "-C" + COMPONENT.SPACE_SEPARATOR;
  let searchPattern = "";
  gdfDetails.map(function(each){
    unitData = unitData + each.unit + ",";
    searchPattern = searchPattern + "-p" + COMPONENT.SPACE_SEPARATOR + each.searchPattern + COMPONENT.SPACE_SEPARATOR;
  })

  val = val +  unitData.substring(0,unitData.length-1) + COMPONENT.SPACE_SEPARATOR + searchPattern.trim();
  return val.trim();
 }

 /**
  * This method used to create options field for nob json based monitor and also to get dropdown label in the table
  * @param formData 
  */
  createDataForNonJsonMon(formData)
  {
    console.log("Method createDataForNonJsonMon called  formData  = ",formData)
    
    let val = '';
    let argumentData = '';
    let that = this;
    this.currHdrsList.map(function(eachObj)
    {
      console.log("Method createDataForNonJsonMon called ,Iterating over header list , eachObj =  ",eachObj)

      if(that.type == COMPONENT.LOG_PATTERN_TYPE)
      {
        that.monConfigurationService.getDropDownLabelForCheckMon(formData,eachObj) // get label for the dropdown when added in the table.
        val = that.createOptionsForLogPatternMonitor(formData)
        return val;
      }
      
      /** this check is for skipping endPhasename value if  endEvent in not 3 . either endPhaseName or count is allowed **/
       if(eachObj.field == COMPONENT.END_PHASE_NAME && formData[COMPONENT.END_EVENT] != 3 ) 
         return null;
 
       if(eachObj.field == COMPONENT.COUNT && formData[COMPONENT.END_EVENT] == 3)
         return null;

      /*Get dropdown label to be displayed in the table for each corresponding dropdown value*/
      if(that.type == COMPONENT.CHECK_MON_TYPE) // for check monitor 
        that.monConfigurationService.getDropDownLabelForCheckMon(formData,eachObj)

      if(eachObj.field != 'name' && !eachObj.field.includes("_ui") && formData[eachObj.field] != null &&  formData[eachObj.field] != '')
      {
        if(eachObj['isUrlEncode'])
         val = val + " " + encodeURIComponent(formData[eachObj.field]);
        else
         val = val + " " + formData[eachObj.field];
       
        val = val.trim();
      }
    })
    return val;
  }


  /**This method returns selected row on the basis of Id */
   getSelectedRowIndex(data): number 
   {
    let index = this.tableData.findIndex(each => each["id"] == data)
    return index;
   }



  /** 
   * Method to validate following combination of server name and app name 
   * do exists in the configuration table or not
   * 
   * Here name =  appName                   in case of json based monitor
   *           = chkMonName/serverSignname  in case of non json based monitor
   */
  validateAppNameAndServerName(name,serverName,instanceName): boolean
  {
     console.log("name  =  " , name + "and serverName = " , serverName  + " Instance Name =  " + instanceName);
     let key = "";
     
     if(instanceName == null)
         key = serverName + name; // variable to hold server name and coresponding app name
     else
         key = serverName + name + instanceName;


     console.log("this.tempArr = ", this.tempArr)

     let keyFound = _.find(this.tempArr, function (each) { return each == key })

     console.log("keyFound = ",keyFound)

    /**** Check whether the key already exist or not in the tempArr
     * if found then return else add the key to the tempArr
     */
    if (keyFound)
      return true;
    else {
      this.tempArr.push(key);
      return false
    }
  }

 
  /*This method is used to delete selected configuration when user selects row and then delete.
   * This method is also used to delete all configuration when user has not selected the row 
   * and want to delete all configurations at once
   */
  deleteAllConfig()
  {
    /* This flag is used to check whether any row is selected for delete or not*/
    let noRowSelected: boolean = false;

    console.log("Method deleteAllConfig called , this.selectedTableData = " , this.selectedTableData)

    if (this.selectedTableData == null || (this.selectedTableData != null && this.selectedTableData.length == 0))
       noRowSelected = true;

      this.confirmationService.confirm({
      message: (noRowSelected) ? 'Do you want to delete all configuration(s)?' : 'Do you want to delete selected configuration(s)?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        let arrId = [];
        if (noRowSelected)
         this.selectedTableData = this.tableData; // if no row is selected then set the whole table data in the selected table data to perform delete
        
        /*This is used to make an array for combinations of server name and app name which are going to be deleted*/
        let selectedServerEntry = [];
        
        this.selectedTableData.map(function(each)
        {
          arrId.push(each.id); // push items to be deleted
          selectedServerEntry.push(each.serverName + each.appName); // pushing combination of server name and app name in an array to be deleted from tempArr
        })

        this.tableData = this.tableData.filter(function(val)
        {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

        /* To delete key combination from the array used in validateAppNameAndServerName() method 
         * for checking duplicate server entry
         */
          this.tempArr = this.tempArr.filter(function(item)
          {
             return selectedServerEntry.indexOf(item) == -1;
          })

         /*Case when edit and delete operation are performed simultaneously*/
         let that = this;

         if (!this.isNewConfig && arrId.indexOf(this.formData['id']) != -1)
         {
             that.clearFormFields();
             that.isNewConfig = true;
         }


          /**clearing object used for storing data ****/
          this.selectedTableData = [];
    },
      reject: () => {
        this.selectedTableData = [];
      }
    });
  }

  /*This method is used to delete selected rows*/
  deleteSpecificConfig(rowData) 
  {
    this.confirmationService.confirm({
      message: 'Do you want to delete selected configuration?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        let arrId = [];

         /*This is used to make an array for combinations of server name and app name which are going to be deleted*/
         let selectedServerEntry = [];

        arrId.push(rowData.id) // push selected row's id 
        selectedServerEntry.push(rowData.serverName + rowData.appName); // pushing combination of server name and app name in an array
       
        this.tableData = this.tableData.filter(function(val)
        {
          return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
        })

         /*To delete key combination from the array used in validateAppNameAndServerName() method 
          *for checking duplicate server entry
          */
          this.tempArr = this.tempArr.filter(function(item)
          {
             return selectedServerEntry.indexOf(item) == -1;
          })

          /* Case when user is editing a row and 
           * wants to delete that row without performing edit operation, then at edit time as we are
           * doing delete operation so the form fields must get cleared after delete
           * is performed on the row selected for edit
           */
          if (!this.isNewConfig && (this.formData['id'] == rowData['id']))
          {
              this.clearFormFields();
              this.isNewConfig = true;
          }
      },

      reject: () => {
      }
    });

  }
     
  /* Method to test monitor.
  * This method is used to start a test for testing the monitor generating a test run number
  */
    startTest(configuredData)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to run test for ' + this.monName + '?',
        header: 'Test Monitor Confirmation',
        icon: 'fa fa-question-circle',
        accept: () => {
  
          this.monConfigurationService.testMonitor(configuredData, this.topoName, this.mjsonName, this.tierName, this.monName)
          .subscribe(res =>{
            console.log("res--- " , res)
                   /*This check is to see whether test is started successfully or not.*/
                   if (res.status == "fail")
                   {
                     this.messageService.errorMessage("Test monitor failed");
                   }
                   else
                   {
                     this.showdialog = true;
                     this.testRunNumber = res.testRun;
                     this.messageService.successMessage("Test started Successfully")
                   }
                });
              },
  
              reject: () => {
              }
            });
     
    }
  
 /*Method to view dashboard for the generated test run*/
  goToWebDashboard(testRunNum) 
  {
  //  console.log("testRunNum ---- ", testRunNum)
  //  this.cavConfigService.$dashboardTestRun = testRunNum;
  //  this.navService.addNewNaviationLink('dashboard');
  //  this.router.navigate(['/home/dashboard']);
  }
 
  /**  This method is called to display the app name , java home , and java class path -- column
  *   in the configured data table for kubernetes monitor 
  */
 displayAppHomeClassPathField(data)
 {
    for (var i = 0; i <data.length ; i++ ) 
    {
      
      if (data[i]["type"] == "appName") {
         this.displayAppNameColumn = true;
       }
       else if(data[i]["type"] == "javaHome"){
          this.displayJavaHomeColumn = true;
       }
       else if(data[i]["type"] == "classPath"){
         this.displayClassPathColumn = true;
       }
       else if(data[i]["type"] == "instanceName"){
         this.displayInstanceNameColumn = true;
       }
        
       if(this.displayAppNameColumn && this.displayJavaHomeColumn && this.displayClassPathColumn && this.displayInstanceNameColumn)
         break;
     }
 }


 /*This method is called when user clicks on cancel button to close the configuration without making any changes.
 * This method shows a new form to perform ADD operation.
 */
 closeConfiguration()
 {
   this.clearFormFields();
   this.isNewConfig = true; 
 }

 /*This is used to clear form fields when ADD is performed */
 clearFormFields(){
 
  this.formData = new TableData();
  /** clearing the fields ****/
  if(this.tempData != null &&  Object.keys(this.tempData).length != 0)  /**handling case when compArgsjson = {} **/
    this.compArgs =  JSON.parse (JSON.stringify(this.tempData));
 }

 ngOnDestroy() 
 {
   console.log("moving out of compoent--",this.tableData + "   this.monConfigurationService.getSelectedRow  =" +this.monConfigurationService.getSelectedRow())
   let obj = {"tier":this.tierName,"data":this.tableData,"monName":this.monName}
  
  /**handling the case when user only enters the configuration screen but do not add any configuration**/
   this.monConfigurationService.saveConfiguredData(obj);

    /*** for updating colormode and colorName ***/  
    this.monConfigurationService.updateColorModeAndName(this.monConfigurationService.getSelectedRow(),this.tierName)
    

   if(this.subscription)
     this.subscription.unsubscribe();

   if(this.subscriptionConfiguredData)
     this.subscriptionConfiguredData.unsubscribe();

  }

}
