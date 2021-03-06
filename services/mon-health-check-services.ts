
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

    uniqueKey:any[]=[]
  
    constructor(private _restApi: RestApiService,
      private monConfigServiceObj : MonConfigurationService,
      private monDataService: MonDataService,private http: Http) {
 
    }

    handleError;
    getHealthCheckTreeTableData()
    {
     return this.healthCheckTreeTableData;
    }
    
    getNodeName()
    {

    }

    setHealthCheckTreeTableData(heathCheckMonitorData)
    {
    
     this.healthCheckTreeTableData = heathCheckMonitorData;
    }


    savehealthCheckData(heathCheckMonitorData,globalProps,enableHealthCheckMon)
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
      console.log("heathCheckMonitorData",heathCheckMonitorData)
      let test = data.map(function(each)
      {
        return JSON.parse(each);
      })

       let url = this.monDataService.getserviceURL() + URL.SAVE_HEALTH_CHECK_DATA + "?productKey=" + this.monDataService.getProductKey() ;
       let params = {
        'topoName': this.monConfigServiceObj.getTopoName(),
        'jsonName': this.monConfigServiceObj.getProfileName(),
        'userName': this.monDataService.getUserName(),
		    'testRunNum': this.monDataService.getTestRunNum().toString(),
        'monMode': this.monDataService.getMonMode().toString(),
        'customConfiguratons':{"data":test},
        'globalConfiguration':globalProps,
        'enabled':enableHealthCheckMon,
        'role':this.monDataService.$userRole        
      };
  
    return this._restApi.getDataByPostReq(url, params)
    }    

    getHealthChkMonData(globalProp)
    {
       let url = this.monDataService.getserviceURL() + URL.GET_HEALTH_CHECK_DATA + "?productKey=" + this.monDataService.getProductKey();
       console.log("Method getHealthChkMonData calleed ",url)
       let params = {
        'topoName': this.monConfigServiceObj.getTopoName(),
        'jsonName': this.monConfigServiceObj.getProfileName(),
        'userName': this.monDataService.getUserName(),
        'customConfiguratons':{'data':[]},
        'globalConfiguration':globalProp,
        
      };
       return this._restApi.getDataByPostReq(url, params)
      }
     
  }
