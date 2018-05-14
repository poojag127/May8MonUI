import { Component, OnInit, Input } from '@angular/core';
import { UtilityService } from '../../../../services/utility.service';
import { GdfTableData} from '../../../../containers/gdf-table-data';
import { ImmutableArray } from '../../../../utility/immutable-array';
import { MessageService } from '../../../../services/message.service';
import * as CHECK_MON_DROPDOWN_LIST from '../../../../constants/check-mon-dropdown-constants';

@Component({
  selector: 'app-cav-log-pattern-monitor',
  templateUrl: './cav-log-pattern-monitor.component.html',
  styleUrls: ['./cav-log-pattern-monitor.component.css']
})
export class CavLogPatternMonitorComponent implements OnInit {

  @Input()
  item: Object;

  /*flag used to display dialog*/
  addDialog: boolean = false;

  /*List for log file name */
  logFileSelectionList:any[] = [];

  selectedLogFile:string;

  runOptionList:any[] = [];
  
  metricList:any[] = [];
  
  unitList:any[] = [];
  
  logMonType:string;
  
  gdfData:GdfTableData;

  /*This variable is used to show header on ADD and EDIT functionality for GDF detail Table*/
  dialogHeaderForTable:string;

  /*This variable is used to store the selected gdf details*/
  selectedGDFdetails:GdfTableData[];

  /*This variable is used to hold temporary id of the selected row of gdf details table used in EDIT functionality */
   tempId:number = 0;

   /*This variable is used to check whether it is ADD/EDIT functionality*/
   isFromAdd: boolean;

   /*Counter for ADD/EDIT  */
   count:number = 0;

  constructor(private messageService: MessageService) { }

  ngOnInit() 
  {
    let arrLabel = ['Use file name', 'Use command to get the file name', 'Use JournalD'];
    let arrValue = ['-f','-c','-f __journald']
    this.logFileSelectionList = UtilityService.createListWithKeyValue(arrLabel,arrValue);

    // let runOptionLabel = ['Run Once', 'Run periodically till test is over'];
    // let runOptionValue = ['2','1'];
    this.runOptionList = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.RUN_OPTION_LABEL, CHECK_MON_DROPDOWN_LIST.RUN_OPTION_VALUE);

    let metricListLabel = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
    let metricListValue = ['Application Metrics','System Metrics','Custom Metrics'];
    this.metricList = UtilityService.createListWithKeyValue(metricListLabel, metricListValue);

    let unitListlabel = ['Per Sec', 'Per Min'];
    let unitListValue = ['PerSec', 'PerMin'];
    this.unitList = UtilityService.createListWithKeyValue(unitListlabel, unitListValue);
  }

  
/**For ADD Functionality-
  *This method is called when user want to ADD gdf details
  */
  openDialog()
  {
    this.dialogHeaderForTable = "Add Graph Definition Details";
    this.addDialog = true;
    this.gdfData = new GdfTableData();
    this.isFromAdd = true;
  }

  /*This method is called when cancel operation performed for closing the dialog of gdf details*/
  closeDialog()
  {
     this.addDialog = false;
  }

 /** For SAVE Functionality-
   * This method is called when user performs save operation when ADD/EDIT is done for the gdf details.
   */
  saveGDFdetails()
  {
     this.getDropDownLabel();
    /* for saving the details on ADD Functionality*/
    if(this.isFromAdd) 
    {
      this.gdfData["id"] = this.count;
      this.item['gdfDetails']=ImmutableArray.push(this.item['gdfDetails'], this.gdfData);
      this.count = this.count + 1;
      this.addDialog = false;
    }
    
    /*for saving the updated details on EDIT functionality*/
    else 
    {
      this.gdfData["id"] = this.tempId; 
      this.item['gdfDetails'] =  ImmutableArray.replace(this.item['gdfDetails'] , this.gdfData, this.getSelectedRowIndex(this.gdfData["id"]))
      this.isFromAdd = true;
      this.addDialog = false;
      this.selectedGDFdetails = [];
    }
  }

  /**For EDIT Functionality-
   *This method is called when user want to edit the graph definiton details
   */
  editDialog()
  {
    if (!this.selectedGDFdetails || this.selectedGDFdetails.length < 1) 
    {
      this.messageService.errorMessage("No row is selected to edit");
      return;
    }
    else if (this.selectedGDFdetails.length > 1)
    {
      this.messageService.errorMessage("Select a single row to edit");
      return;
    }

    this.addDialog = true;
    this.isFromAdd = false;
    this.dialogHeaderForTable = "Edit Graph Definition Details";

    this.tempId =  this.selectedGDFdetails[0]["id"];  
    this.gdfData = Object.assign({}, this.selectedGDFdetails[0]);
  }

  /*This method returns selected row on the basis of Id */
  getSelectedRowIndex(data): number 
  {
    let index = this.item['gdfDetails'].findIndex(each => each["id"] ==  this.tempId)
    return index;
  }

/** For DELETE Functionality-
  * This method is used to delete entries of the gdf details data table 
  */
  deleteGDFDetails()
  {
   console.log("Method deleteGDFDetails()  called , selectedGDFdeatils = ", this.selectedGDFdetails)
   if (this.selectedGDFdetails.length == 0) 
    {
     this.messageService.errorMessage("No record is present to delete");
     return;
    }

    let arrId = [];
    this.selectedGDFdetails.map(function(each)
    {
      console.log("each= ",each)
      arrId.push(each["id"])
    })
    console.log("arrId = ", arrId)

    this.item['gdfDetails'] = this.item['gdfDetails'].filter(function(val)
    {
      console.log("val =", val.id)
      return arrId.indexOf(val["id"]) == -1;  //value to be deleted should return false
    })

   /**clearing object used for storing data */
    this.selectedGDFdetails = [];
  }

  /*This method is used to get the dropdown label in the table*/
  getDropDownLabel()
  {
    console.log("getDropDownLabel , unit= ", this.gdfData['unit'])
    let key = this.gdfData['unit'];
    console.log("key", key)
    let that = this;
    console.log(" this.unitList =",  this.unitList)
    this.unitList.map(function(each){
      if(each.value == key)
      {
        that.gdfData['unit-ui'] =  each.label;
      }
    })
  }
}
