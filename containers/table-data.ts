 import * as COMPONENT from '../constants/mon-component-constants';
 import { GdfTableData} from '../containers/gdf-table-data';

 export class TableData
 {
   id:number;
   serverName:string;
   arguments:string; //field used for showing data to UI
   options:string;   //field used for sroring argumnet to be send to server
   appName:string;
   javaHome:string;
   classPath:string;  
   compValWithId:Object;//field used to storing data mapped with its id,used for edit purpose,
   instance:string;
   
      
   name:string;
   type:number;

  //  check-mon-name:string;
  phaseName: string = "NA";
  periodicity: string="NA";
  count: string = "NA";
  endPhaseName:string = "NA";
  checkMonProgName: string;
  fromEvent: string ="NA";
  fromEvent_ui:string = "NA";
  frequency: string="2";
  frequency_ui:string = "Never";
  endEvent: string = "NA";
  endEvent_ui:string = "NA";
 
 //for log Pattern monitor
  gdfName:string;
  runOptions:string ="2";
  runOptions_ui:string = "Run Once";
  fileNameSelection:string= "-f";
  fileName :string;
  enableSearchPattern:boolean;
  searchPattern:string;
  metric:string = "Application Metrics";
  customMetricName:string;
  journalType:string;
  specificJournalType:string;
  gdfDetails:GdfTableData[]=[];
  groupId:number=-1;


 
 }


 