
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import * as URL from '../constants/mon-url-constants';
import { RestApiService } from './rest-api.service';
import { MonDataService } from './mon-data.service';
import { ConfirmationService, TreeNode } from 'primeng/primeng';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MonConfigurationService} from './mon-configuration.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui'; // Import BlockUI decorator & optional NgBlockUI type

//   /* Decorator wires up blockUI instance*/
//   @BlockUI() blockUI: NgBlockUI;

@Injectable()
export class MonHealthCheckService {


    healthCheckTreeTableData: TreeNode[] = [];
    
    private topoName: string; // to store topology name 
  
    private profileName: string; // to store profile name
  
    constructor(private _restApi: RestApiService,
      private monConfigServiceObj : MonConfigurationService,
      private monDataService: MonDataService,private http: Http) {
 
    }

    handleError;
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
    //  let arr = [];
    //  let obj =  { "data":{  
    //               "nodeName":"Tier1",
    //               "arguments":"Active",
    //               "prop":{
    //                   "host":"",
    //                   "port":"",
    //                  "ping":{"packet":"","proxy":""},
    //                  "socket":{"packet":"","interval":""},
    //                  "http":{"uName":"","pwd":""}
    //                   }
    //                },
    //                "leaf":false,
    //                "children":[
    //                     { "data":{  
    //                       "nodeName":"Server",
    //                       "arguments":"Active",
    //                       "prop":{
    //                         "host":"",
    //                          "port":"",
    //                         "ping":{"packet":"","proxy":""},
    //                  "socket":{"packet":"","interval":""},
    //                  "http":{"uName":"","pwd":""}
    //                   }
    //                },
    //                "leaf":true
    //                     }

    //                ]
    //                } 

    // console.log("obj =" , obj)
    //  arr.push(obj)
    //  console.log("arr = ", arr)
    //  let obj2 = {"data":arr};
    //  console.log("obj2= ", obj2)
    //  this.healthCheckTreeTableData = obj2.data;

    this.healthCheckTreeTableData = heathCheckMonitorData
    }

    readHealthMonitorJson(topoName, profileName, mode, userName, trNum )
    {
    //   console.log("Method readHealthMonitorJson called = ")
    //   let url = this.monDataService.getserviceURL() + URL.GET_HEALTH_MON_STATS;
    //   let params: URLSearchParams = new URLSearchParams();
    //    params.set('topoName', this.topoName);
    //    params.set('profileName', this.profileName);
    //    params.set('monMode', this.monDataService.getMonMode().toString());
    //    params.set('userName', this.monDataService.getUserName());
    //    params.set('testRun', this.monDataService.getTestRunNum().toString());
    //    params.set('productKey', this.monDataService.getProductKey());

    //    return this.http.get(url, { search: params }).map(res => res.json())
    //      .toPromise()
    //      .then(res => {
            
    //   }).
    //   catch(this.handleError);
    let url = this.monDataService.getserviceURL() + URL.GET_HEALTH_MON_STATS + "?topoName=" + `${topoName}` + "&profileName=" + `${profileName}` + "&mode=" + `${mode}` + "&userName="+ `${userName}` + "&testRun="+ `${trNum}` + "&productKey=" + this.monDataService.getProductKey();
    console.log("url for health Chk Mon --", url)
    return this._restApi.getDataByGetReq(url);
    }



    savehealthCheckData(heathCheckMonitorData,GlobalProps)
    {
      let cache = [];
      let data =[];
      let returnDatap;
      returnDatap = heathCheckMonitorData.map(function(each)
      {
        let data2:{};
        data2= JSON.stringify(each, function(key, value)
        {
          if (typeof value === 'object' && value !== null)
          {
            if (cache.indexOf(value) !== -1)
            {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          console.log("value = ",value)
          return value;
        });

        console.log("data2 = ",data2)
         data.push(data2);
         console.log('data==',data)
         return data2;
      });
      console.log("cache = ",cache)
     
      //   cache = null;
      //  downlaodAlert.baselineDataMap = dataObj;
      //   downlaodAlert.arrRules = null;
       console.log("heathCheckMonitorData",heathCheckMonitorData)

      let test = data.map(function(each)
      {
        return JSON.parse(each);
      })
      console.log("test = ",test)

      console.log("data = ",heathCheckMonitorData)
      console.log("data = ",data)
       let url = this.monDataService.getserviceURL() + URL.SAVE_HEALTH_CHECK_DATA + "?productKey=" + this.monDataService.getProductKey() ;
       let params = {
        'topoName': this.monConfigServiceObj.getTopoName(),
        'jsonName': this.monConfigServiceObj.getProfileName(),
        'userName': this.monDataService.getUserName(),
        // 'testRunNum': this.monDataService.getTestRunNum().toString(),
        // 'monMode': this.monDataService.getMonMode().toString(),
        // 'customConfiguratons':{"data":[{"leaf":true}]},
         'customConfiguratons':{"data":test},
        'globalConfiguration':GlobalProps
        // 'role':this.monDataService.$userRole
      };
  
    return this._restApi.getDataByPostReq(url, params)
    }    

}
