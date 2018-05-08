import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {ConfirmationService, TreeNode} from 'primeng/primeng';
import { MonConfigurationService } from '../../../services/mon-configuration.service';
import * as _ from "lodash";
import { HideShowMonitorData } from '../../../containers/hide-show-monitor-data';

@Component({
  selector: 'app-cav-mon-hide-show',
  templateUrl: './cav-mon-hide-show.component.html',
  styleUrls: ['./cav-mon-hide-show.component.css']
})

export class CavMonHideShowComponent implements OnInit {

  /* Available Tree nodes. */
  nodes: TreeNode[];

 /* Selected Tree nodes. */
  selectedNodes: TreeNode[];

  /* This flag is used to make dialog for show hidden monitors visible */
  displayDialog: boolean = true;

  hideShowMonitorData: HideShowMonitorData;

  /*This flag is used to bind value of the checkbox*/
  checked:boolean = false; 

  constructor(private monConfServiceObj: MonConfigurationService,
              private dialogRef: MdDialogRef<CavMonHideShowComponent>, 
              private confirmationService: ConfirmationService
              ) { }

  ngOnInit()
  {
    {
     this.monConfServiceObj.getHiddenMonitorList().subscribe(data =>{
       this.nodes = data;
      });
    } 
    this.monConfServiceObj.clearHideShowMonList(); // to clear hideShowList.
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
      this.dialogCloseEvent();
  },
    reject: () => {
    }
  });
}

  onCheckBoxChangeState(rowData, chk)
  {  
    
    console.log("Method onCheckBoxChangeState  called, rowData = ", rowData)
    let hideShowMonList  = this.monConfServiceObj.getHideShowMonList(); // to get the list of monitors to be shown.

    let existingObj;
    if (rowData['children'] ==  null) // when child node is only checked that means the selected checkbox is for a child node.
    {
      existingObj = _.find(hideShowMonList,function(each) {return each['category'] == rowData.parent['data']})
    }  
    else  // when parent node checkbox is selected that means when children are present for that selected parent node.
    {
      existingObj = _.find(hideShowMonList,function(each) {return each['category'] == rowData['data']})
    }
    
    console.log("existingObj = ",existingObj)

    if (chk) // means when the checkbox is checked for a given node.
    {
      let childMonList = []; // an array for storing child nodes.

      if(existingObj == null) // when the hideShowMonList is empty initially when no node is selected, we do need to add the hideShowMonitorData.
      {
        /*Case when only child node is selected and parent node is not selected.*/
       if (rowData.parent != null) // means the selected node is a child node.
       {
        rowData.parent['children'].map(function(each) // get each children of that corresponding parent
        {
          if (each['data'] == rowData['data']) // check whether selected box node matches with the node data or not.
            childMonList.push(each['data'])  // push that child node in an array.
        })
        this.hideShowMonitorData = new HideShowMonitorData(); 
        this.hideShowMonitorData.category = rowData.parent['data']; // set category as the parent node label
        this.hideShowMonitorData.subCategory = childMonList; // set all the children selected in the subcategory.
        hideShowMonList.push(this.hideShowMonitorData); 
       }

      else // when parent node is checked and no child node is selected.In that case all the child nodes of that parent must get checked.
      {
        /* Case when only the parent node is checked and no children is checked.
         * So that means when the parent node is selected all the child nodes must get selected
         */
        rowData.children.map(function(each)
        {
          each['checked'] = true; 
          childMonList.push(each['data']); // make al the child nodes get checked when only the parent node is selected.
        })

          this.hideShowMonitorData = new HideShowMonitorData(); 
          this.hideShowMonitorData.category = rowData['data'];
          this.hideShowMonitorData.subCategory = childMonList;
          hideShowMonList.push(this.hideShowMonitorData);
       }

       if(rowData['children'].length == 0)
       {
        let subCategoryList = [];
        subCategoryList.push("All");
        

        this.hideShowMonitorData = new HideShowMonitorData(); 
        this.hideShowMonitorData.category = rowData['data']; // set category as the parent node label
        this.hideShowMonitorData.subCategory = subCategoryList; // set all the children selected in the subcategory.
        hideShowMonList.push(this.hideShowMonitorData); 
       }
      }

      else if (existingObj != null)
      { 
          /*Case when an entry is already made in the hideShowMonList, we only need to append data as per the selected checkbox state*/
          if (rowData.parent != null) // mean the selected checkbox is of a child node.
          {
            if(rowData.parent['data'] == existingObj['category']) // case when the selected child node's parent node is already existing the hideShowMonList.
           {
              childMonList = [];
              childMonList = existingObj['subCategory'];

              rowData.parent['children'].map(function(each) 
              {
                if (each['data'] == rowData['data'])
                 childMonList.push(each['data'])
               })

            }
          } 
        else 
        {
          if (rowData['data'] == existingObj['category'] )
          {
            rowData.children.map(function(each)
            {
              each['checked'] = true;
            })
            childMonList.push("All"); 
          }

            this.hideShowMonitorData = new HideShowMonitorData(); 
            this.hideShowMonitorData.category = rowData['data'];
            this.hideShowMonitorData.subCategory = childMonList;
            hideShowMonList.push(this.hideShowMonitorData);
        }
      }

    }
    else // when unchecked a checkbox
    {
      existingObj.subCategory.map(function(each){
        console.log("each of subcategory =" , each)
        if(rowData['data'] == each){
          existingObj.subCategory = existingObj.subCategory.filter(function(val){
            return val != each
            
          })
        }
      })

      if (rowData['children'] != null) // when the parent node is unchecked , then its children needs to get unchecked.
      {
        rowData.children.map(function(each){
          each['checked'] = false;
        })
        existingObj.subCategory = existingObj.subCategory.filter(function(val){return val != existingObj.subCategory
        })
        hideShowMonList = hideShowMonList.filter(function(val){return val['category'] != existingObj['category']
       })
      }
    }
    this.monConfServiceObj.setHideShowMonList(hideShowMonList)
  }
  


  dialogCloseEvent($evt?: any) {
    if(this.dialogRef) {
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.dialogCloseEvent();
  }

}
