import { Injectable } from '@angular/core';
import * as COMPONENT from '../constants/mon-component-constants';
import * as ARGKEYMAP from '../containers/gdf-key-data';
import { LogParserGdfData } from '../containers/log-parser-gdf-data';
import { GetLogFileGDFData } from '../containers/get-log-file-gdf-data';


@Injectable()
export class GdfService {

 logParserGdfData : LogParserGdfData;

 /**** To store gdf details of log Pattern monitor tierwise ***/
 logPatternGdfDataByTier : {}; 
 

 addGdfData(tableData,monName,tierName)
 {
   console.log("Method addGdfData called , monName = " ,monName + " tableData = " ,tableData  + "  tierName =" , tierName)
   if(monName == COMPONENT.LOG_PATTERN_MONITOR)
   {
    this.getTableDataForGDF(tableData,ARGKEYMAP.logParserGDFKeyArgs,tierName);
   } 
  }
  

  getTableDataForGDF(tableData,logParserGDFKeyArgs,tierName)
  {
    let newTableData:any[] = [];
    let obj = { };
    let that = this;
    tableData.map(function(each){
      that.logParserGdfData = new  LogParserGdfData();
      that.logParserGdfData.searchPattern = each["-p"];
      that.logParserGdfData.graphName = each["graphName"];
      that.logParserGdfData.unit  = each["unit"];
      newTableData.push(that.logParserGdfData); 
    })

    if(this.logPatternGdfDataByTier != null && this.logPatternGdfDataByTier[tierName] != null)
    {
     this.logPatternGdfDataByTier[tierName] = newTableData;
    }
    
    

  }

}