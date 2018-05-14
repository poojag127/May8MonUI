
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

    //mjsonname: any[];
    constructor(private _restApi: RestApiService, private monDataService: MonDataService,private http: Http) {
 
    }

    getHealthCheckTreeTableData()
    {
   
    
     return this.http.get('../../../assets/filesystem.json')
                    .toPromise()
                    .then(res => <TreeNode[]> res.json().data);
    //   this.nodeService.getFi\les().then(files => this.healthCheckTreeTableData = files);
     
    }
   

   
}
