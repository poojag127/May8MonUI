import { ServerConfigData } from './server-config-data';
// import { LogParserGdfData } from './log-parser-gdf-data';
import { GdfTableData } from './gdf-table-data';

export class MonConfigData
{
 monName: String;
 isEnabled : boolean;
 serverDTOList: ServerConfigData[];
 monType:number;
 logParserGdfData:GdfTableData[];
}