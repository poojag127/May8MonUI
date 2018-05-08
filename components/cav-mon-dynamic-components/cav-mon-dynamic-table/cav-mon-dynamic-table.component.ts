import { Component, OnInit ,Input ,Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ImmutableArray } from '../../../utility/immutable-array';
import { MessageService} from '../../../services/message.service';
import * as _ from "lodash";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MonConfigurationService } from '../../../services/mon-configuration.service';


@Component({
  selector: 'app-cav-mon-dynamic-table',
  templateUrl: './cav-mon-dynamic-table.component.html',
  styleUrls: ['./cav-mon-dynamic-table.component.css']
})
export class CavMonDynamicTableComponent implements OnInit {

  @Input()
  tableCompData: {};

  @Input()
  disabled:boolean;

  @Output()
  updateTableVal = new EventEmitter();

  columnData:any[]= [];

  /**holds the header data of the table */
  cols: any[]=[];

  /**Flag for ADD/EDIT options of the dynamic dataTable */ 
  isNewRow:boolean = false;

  /** Flag for ADD/EDIT dialog box */
  addEditDialog:boolean;

  /** Used to store dataTable data */
  tableData:any[]=[];

   /** Used to hold selected row data of the dataTable **/
   selectedJson:any[] = [];

   /**Counter for ADD/EDIT  */
   count: number = 0;

   /**Used to hold temporary id of the selected row ,used in edit functionality */
   tempId:number = 0;

   /**Used to display header for respective data tables */
   headerForTable:string;
 
  /**Used to display header for ADD/EDIT dialog box for respective data tables */
   dialogHeaderForTable:string;
   subscription:Subscription;
   
   monName :string;

  constructor(private messageObj: MessageService, 
              private store: Store<Object>,
              private router:Router,
              private route: ActivatedRoute,
              private monConfigurationService: MonConfigurationService
              ) { }

  ngOnInit()
   {
    console.log("Class CavMonDynamicTableComponent called")
    this.headerForTable = this.tableCompData["label"]; // assigning the header to the respective data tables
    console.log("columnData--", this.tableCompData["columnData"])
    this.columnData = this.tableCompData["columnData"];
    let that = this;
    this.subscription = this.store.select("selectedMon")
               .subscribe(data => {
         console.log("data--deom reducer--",data)
         if(data != null &&  Object.keys(data).length != 0)  /***handling case when data ="{}"****/
         {
          let compArgs = data["data"];
          that.getTableData(compArgs);
         }
    })
    this.columnData = this.tableCompData["columnData"];
   
    this.columnData.map(function(each)
    {
      console.log("each---",each)
      let key = each.arg;
      if(each.type == "Dropdown")
      {
       key = "ui-" + each.arg;
      }
      that.cols.push({"field":key,"header":each.label})
    })


    this.route.params.subscribe((params: Params) => {
      this.monName = params['monName'];
    })
  }

 
  /** For ADD Functionality- 
   * This method is used to show ADD Dialog for adding new entries in the dataTable
   */
   openAddDialog(){
     console.log("openAddDialog() method called")
     this.isNewRow = true;
     this.addEditDialog = true;
     this.dialogHeaderForTable = "Add " + this.headerForTable;
     this.clearFieldData();
   }


 /** For EDIT Functionality-
  * This method is used to show EDIT Dialog for editing existing entries in the dataTable 
  */
  openEditDialog()
  {
    this.dialogHeaderForTable = "Edit " + this.headerForTable;
    console.log("openEditDialog method called",this.selectedJson );
    if (!this.selectedJson || this.selectedJson.length < 1) 
    {
      this.messageObj.errorMessage("No row is selected to edit");
      return;
    }
    else if (this.selectedJson.length > 1)
    {
      this.messageObj.errorMessage("Select a single row to edit");
      return;
    }
    
    this.tempId =  this.selectedJson[0]["id"];  
    console.log("this.tempId--",this.tempId)

    let that = this;
    this.columnData.map(function(each)
    {
      each.value = that.selectedJson[0][each.arg]
    })

    this.isNewRow = false;
    this.addEditDialog = true;
  }
  
/** For SAVE Functionality-
  * This is common method used to submit and save data when ADD/EDIT is performed
  */
  saveData()
  {
    console.log("saveData() Method called");

    /**** Check for whether an item is selected from the dropdown list or not   */
    let dropDownObj = _.find(this.columnData,function(each){return each.type == 'Dropdown'})
    if(dropDownObj != null && !this.validateField(dropDownObj)){
      return;
    }

    this.addEditDialog = false;
    let data = {};
    console.log("this.columnData---- " , this.columnData)

    /**** creating row object for table from the fields of form ****/
    this.columnData.map(function(each)
    {
      console.log("each ---------------- ", each)
      data[each.arg] = each.value;   
      
      if(each.dropDownList !=  null)
      {
        let obj = _.find(each.dropDownList,function(list) { return list.value == each.value})
        /**creating this key for UI purpose *******/
        let key = "ui-" + each.arg;
        data[key] = obj.label;
      }
       console.log("data  ------ ",data)
    })

    console.log("Data added--", data)

    /***Check for ADD/EDIT operation **/
    if (this.isNewRow)
    {
      data["id"] = this.count;
      //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
      this.tableData=ImmutableArray.push(this.tableData, data); //adding new entries in the datatable when ADD is performed
      this.count = this.count + 1;
    console.log("tableData--",this.tableData)
    }
    else
    { 
      data["id"] = this.tempId; //assign temporary id
      this.tableData=ImmutableArray.replace(this.tableData, data , this.getSelectedRowIndex(data))
    }

    
    /**** sending data to parent component *****/
   let obj = {"data":this.tableData,"id":this.tableCompData["id"]}
    
  
   this.updateTableVal.emit(obj);
  //  this.store.dispatch({ type: MONITOR_DATA , payload: obj });

   this.selectedJson = [];
   this.clearFieldData();
   this.isNewRow = false;
  }


  /**This method returns selected row on the basis of Id */
   getSelectedRowIndex(data): number 
   {
    let index = this.tableData.findIndex(each => each["id"] == this.tempId)
    return index;
  }

 
 /** For DELETE Functionality-
  * This method is used to delete entries of the dataTable 
  */
  deleteData()
  {
   console.log("deleteData() method called" , this.selectedJson)
   if (this.selectedJson.length == 0) 
    {
     this.messageObj.errorMessage("No record is present to delete");
     return;
    }

    let arrId = [];
    this.selectedJson.map(function(each)
    {
      arrId.push(each.id)
    })

    this.tableData = this.tableData.filter(function(val)
    {
      return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
    })
    /**clearing object used for storing data ****/
    this.selectedJson = [];
  }

  /** Method to validate whether dropdown item is selected or not in the ADD form  */
  validateField(obj) : boolean
  {
    console.log("ValidateField called")
    let that = this;
    console.log("obj === ", obj)

    if(obj["value"] == null || obj["value"] == '' )
    {
       that.messageObj.errorMessage("Please enter " + obj["label"])
       return false;
    }

    return true;
  }
 
 /**
  * getting the value of tableData from store as data table as ngprime doesnot support ngModel
  * which supports 2 way binding so on editing other component is reflecting ite new value but table not
  * So it needs to rerender the component and that is acheived by store.
  * @param compData 
  */

  getTableData(compData)
  {
    console.log("Method getTableData called")
    let id = this.tableCompData["id"];
    for(let i = 0;i < compData.length; i++)
    {
      if(compData[i]["id"] == id)
      {
       this.tableData = compData[i]["value"] != null && compData[i]["value"] != '' ?  compData[i]["value"] :[];
       break; 
      }
      else if(compData[i]["dependentComp"] != null)
        this.getTableData(compData[i]["dependentComp"])
     
     else if(compData[i]["items"] != null)
        this.getTableData(compData[i]["items"])
    }
  }  
 
 
  /** clearing the form fields after use (safer side code)  */
  clearFieldData()
  {
    this.columnData.map(function(each)
    {
      each.value = '';
    })
  }

}
