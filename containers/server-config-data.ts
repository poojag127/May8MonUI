import { AppConfigData } from './app-config-data';
import { GdfTableData } from './gdf-table-data';

export class ServerConfigData
{
  serverName: String;
  excludeServer: String;
  instanceName: String;
  isEnabled : String;
  monName: String;
//   appDTOList: AppConfigData[];
  runOptions:number=2;
  metric :String;
  groupId :number=-1;
  gdfDetailsList:GdfTableData[];
  gdfName:String;
  appDTOList:any[]=[];
}