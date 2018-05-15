
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import * as URL from '../constants/mon-url-constants';
import { RestApiService } from './rest-api.service';
import { MonDataService } from './mon-data.service';
import { ConfirmationService, TreeNode } from 'primeng/primeng';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class MonHealthCheckService {


    healthCheckTreeTableData: TreeNode[];

    constructor(private _restApi: RestApiService, private monDataService: MonDataService,private http: Http) {
 
    }

    getHealthCheckTreeTableData()
    {
    //  return this.http.get('../../../../assets/filesystem.json')
    //                 .toPromise()
    //                 .then(res => <TreeNode[]> res.json().data);
     return this.healthCheckTreeTableData;
     }

    setHealthCheckTreeTableData(heathCheckMonitorData)
    {
    //  this.healthCheckTreeTableData = heathCheckMonitorData;
     let arr = [];
     let obj =  { "data":{  
                  "nodeName":"Tier1",
                  "arguments":"true",
                  "prop":{
                      "host":"",
                      "port":"",
                     "ping":{"packet":"","proxy":""},
                     "socket":{"packet":"","interval":""},
                     "http":{"uName":"","pwd":""}
                      }
                   },
                   "leaf":false,
                   "children":[
                        { "data":{  
                          "nodeName":"Tier1",
                          "arguments":"true",
                          "prop":{
                            "host":"",
                             "port":"",
                            "ping":{"packet":"","proxy":""},
                     "socket":{"packet":"","interval":""},
                     "http":{"uName":"","pwd":""}
                      }
                   },
                   "leaf":true
                        }

                   ]
                   } 
     arr.push(obj)
     let obj2 = {"data":arr};
     this.healthCheckTreeTableData = obj2.data;
    }

   
   

   
}
