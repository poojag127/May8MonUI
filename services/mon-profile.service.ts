
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import * as URL from '../constants/mon-url-constants';
import { RestApiService } from './rest-api.service';
import { MonDataService } from './mon-data.service';

@Injectable()
export class MonProfileService {

    //mjsonname: any[];
    constructor(private _restApi: RestApiService, private monDataService: MonDataService) {
 
    }

    getTopologyList() 
    {
     console.log("Method  getTopologyList called",this.monDataService.getProductKey())
     return this._restApi.getDataByGetReq(this.monDataService.getserviceURL() + URL.GET_TOPO_LIST + "?productKey="+this.monDataService.getProductKey());
    }

    /** Method to send request to the server to get profile list for the selected topology */
    getProfileList(topoName) {
        let url = this.monDataService.getserviceURL() + URL.GET_PROFILE_LIST + `${topoName}` +"?productKey="+this.monDataService.getProductKey();
        console.log("url", url)
        return this._restApi.getDataByGetReq(url);

    }

    /** Method to send request to the server to delete profiles 
     * from the table for the selected topology. 
     */
    deleteProfileData(topoName, mjsonname) {
        let url = this.monDataService.getserviceURL() + URL.DEL_PROFILE + "?topoName=" + `${topoName}` + "&userName="+this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();

        /**** This is used to get the list of profiles selected for delete operation */
        for (let i = 0; i < mjsonname.length; i++) {
            url = url + "&jsonNameList=" + `${mjsonname[i]}`;
        }
        console.log("url for deleting profile list --  ", url)
        return this._restApi.getDataByGetReq(url);
    }


    /**Method to call service to download(import) selected profile  */
    downloadProfile(topoName,profileName,userName)
    {
      let url = this.monDataService.getserviceURL() + URL.IMPORT_PROFILE + "?topoName=" + `${topoName}` + "&profileName=" + `${profileName}` + "&userName="+this.monDataService.getUserName + "&role=" + this.monDataService.$userRole + "&productKey=" + this.monDataService.getProductKey();
      console.log("url for download--", url)
      return this._restApi.getDataByGetReq(url);
    }

    /*This method is used to test monitor group and generates a test run number for launching web dashboard*/
    testMonitorGroup(data, topoName, profileName, userName)
    {
        let url = this.monDataService.getserviceURL() + URL.TEST_MONITOR_GROUP + "?topoName=" + `${topoName}` + "&profileName=" + `${profileName}` + "&userName="+ `${userName}` + "&productKey=" + this.monDataService.getProductKey();
        console.log("url for TEST_MONITOR_GROUP--", url)
        return this._restApi.getDataByGetReq(url);
    }

}
