import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
//import './config-rxjs-import';

import {MessageService} from './message.service';

@Injectable()
export class RestApiService {

// Wires up BlockUI instance
@BlockUI() blockUI: NgBlockUI;

  constructor(private http: Http, private messageService : MessageService) { }

  className: string = "ConfigRestApiService";

  // Fetch data
  getDataByGetReq(url: string): Observable<any> {
    // this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    // ...using get request
    return this.http.get(url)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.blockUI.stop()
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { this.messageService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error')})
  }

  getDataByPostReq(url: string, body?: any): Observable<any> {
    // this.messageService.progressBarEmit({flag: true, color: 'primary'});
    this.blockUI.start();
    if(body == undefined)
      body = {};
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPostReq", "URL", url, "Body", body);

    return this.http.post(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.blockUI.stop();
        this.messageService.progressBarEmit({flag: false, color: 'primary'});
        return res.json();
      })
      //...errors if any
      .catch((error: any) => { this.messageService.progressBarEmit({flag: true, color: 'warn'}); return Observable.throw(error.json().error || 'Server Error' )});
  }

  getDataByPutReq(url: string, body?: Object): Observable<any> {
    let headers = new Headers({ 'Content-type': 'application/json' });// ... Set content type to JSON
    let options = new RequestOptions({ headers: headers });// Create a request option
    
    console.info(this.className, "getDataByPutReq", "URL", url, "Body", body);

    return this.http.put(url, body, options) // ...using post request
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));
  }

}
