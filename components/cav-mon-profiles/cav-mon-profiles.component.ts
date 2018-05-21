import { Component, OnInit, Output, EventEmitter,AfterViewInit} from '@angular/core';
import { ConfirmDialogModule, ConfirmationService, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { MonDataService } from '../../services/mon-data.service';
import { MonProfileService } from '../../services/mon-profile.service';
import { UtilityService } from '../../services/utility.service';
import { MonConfigurationService } from '../../services/mon-configuration.service';
import { MessageService } from '../../services/message.service';
import * as URL from '../../constants/mon-url-constants';
import { ProfileData } from '../../containers/profile-data';
import { Router } from '@angular/router';

import { MdDialog, MdDialogRef } from '@angular/material';
import { CavScenVersionCommitComponent } from '../../../../main/components/cav-scen-version-commit/cav-scen-version-commit.component';
import { CavScenVersionLogComponent } from '../../../../main/components/cav-scen-version-log/cav-scen-version-log.component';
import * as COMPONENT from '../../constants/mon-component-constants';


@Component({
  selector: 'app-cav-mon-profiles',
  templateUrl: './cav-mon-profiles.component.html',
  styleUrls: ['./cav-mon-profiles.component.css']
})

export class CavMonProfilesComponent implements OnInit {

  //show topology list in the pull down
  topologyList: SelectItem[];
  selectedTopology: String = "";

  //to show data in table
  profileTableData: ProfileData[] = [];

  //those profile which are selected
  selectedProfile: ProfileData[];

  /** Flag to show and hide search filter in the datatable */
  isShowFilter: boolean;

  addProfileDialog: boolean = false;

  addProfile: ProfileData;

  _dialogFileRef: MdDialogRef<CavScenVersionCommitComponent>;
  _dialogLogFileRef: MdDialogRef<CavScenVersionLogComponent>;

  /**This is used to emit "isShowFilter" value */
  @Output()
  showFilterEvent = new EventEmitter<boolean>();

  fileUpload:string;

  /*This flag is used to display the dialog box for the generated test run number.
  * When user clicks on test monitor button then on successfull starting of the 
  * test a dialog box is generated showing the test run number to view the webdashboard.
  */
  showdialog:boolean =false;

  /*This  variable is used to show the test run number */
  testRunNumber:number;
    
  constructor(public dataService: MonDataService, private router: Router, private profileService: MonProfileService,
    private utilityObj: UtilityService, private monConfServiceObj: MonConfigurationService,
    private messageService: MessageService, private _dialog: MdDialog, private confirmationService: ConfirmationService
  ) { 
    console.log("Constructor of  cavMonProfilesComp called")
  }

  ngOnInit() {
 
    console.log("Class CavMonProfilesComponent called")
    this.fileUpload = this.dataService.getserviceURL() +"uploadFile?productKey=" + this.dataService.getProductKey() + "&topoName=";    

    //this method set the parameters come from the product UI
    this.setMonDefaultDataInDataService();

    this.profileService.getTopologyList()
      .subscribe(data => {
        data.unshift("--Select Topology--");
        this.topologyList = UtilityService.createDropdown(data);
      });

    this.isShowFilter = false; //setting default value of show filter to false
  }

  ngAfterViewInit() {
    setTimeout(() => {
    var fileUploadElementRef = document.getElementById("testUpload");
    fileUploadElementRef.firstElementChild.firstElementChild.className = "ui-button-icon-left fa fa-upload";
    },0)
  }

  setMonDefaultDataInDataService() {

  }

  /** Method to load profile data in the table for the selected topology */
  loadProfileData(topoName) {
    if(this.selectedTopology == "")
    {
      this.profileTableData = [];
      return;
    }
    this.profileService.getProfileList(this.selectedTopology)
      .subscribe(data => {
        this.profileTableData = data;
      })
  }

  openAddDialog() {
    this.addProfileDialog = true;
    this.addProfile = new ProfileData();
  }

  saveEditProfile(topoName, addProfile)
  {
    this.addProfileDialog = false;
    
   /*This is used to prevent duplicate entry of monitor groups */
   if (!this.checkMonGroupAlreadyExist()) 
   {
     this.monConfServiceObj.clearData();
     this.monConfServiceObj.setProfileName(addProfile.profileName);
     this.monConfServiceObj.setProfileDesc(addProfile.desc);
     this.monConfServiceObj.setTopoName(topoName);
     this.monConfServiceObj.setVariableInSession(0);
     this.router.navigate([URL.PROF_CONFIGURATION]);
     return;
   }
    //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
    //this.jsonsTableData=ImmutableArray.push(this.jsonsTableData, this.mJsonData);
  }

     /*This method is used to validate the monitor group already
     * exists or not in the selected topology 
     */
    checkMonGroupAlreadyExist(): boolean
    {
      for (let i = 0; i < this.profileTableData.length; i++)
      {
        if (this.profileTableData[i].profileName == this.addProfile.profileName) 
        {
          this.messageService.errorMessage("Monitor group already exist.Please enter a different monitor group name");
          return true;
        }
      }
    }

  editProfile(profileName, topoName) {
    console.log(URL.PROF_CONFIGURATION + "," + profileName + "," + topoName)
    this.monConfServiceObj.clearData();
    this.monConfServiceObj.setProfileName(profileName);
    this.monConfServiceObj.setTopoName(topoName);
    this.monConfServiceObj.setVariableInSession(0);
    this.router.navigate([URL.PROF_CONFIGURATION]);
  }


  /**Method for the show filter in the datatable */
  showFilter() {
    this.isShowFilter = !this.isShowFilter;
    this.showFilterEvent.emit(this.isShowFilter);
    console.log("CavMonRightPaneComponent", "showFilter", "isShowFilter = ", this.isShowFilter);
  }

  /**
  * Method to delete profile(s) 
  * This method is called when user clicks on the delete button in the profile list table
  */
  deleteProfile() : void
  {
    /**** Check whether user has selected rows to delete or not */
    if (!this.selectedProfile || this.selectedProfile.length < 1) 
    {
      this.messageService.errorMessage("Select monitor group(s) to delete");
      return;
    }
      this.confirmationService.confirm({
      message: COMPONENT.DELETE_MON_GROUP_MSG,
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
          let selectedProfileData = this.selectedProfile; // used to hold selected row data of the table
          let arrProf = []; // this array holds profile name of the selected row in the profile list table
          for (let index in selectedProfileData) {
            arrProf.push(selectedProfileData[index].profileName);
          } 
         
        /**** here request is send to server to delete profiles  */
        this.profileService.deleteProfileData(this.selectedTopology, arrProf)
              .subscribe(data => {
                 this.deleteProfileData(); // this is used to delete the profiles from the table from ui side
                 this.messageService.successMessage("Deleted Successfully");
              });
         },
      reject: () => {
      }
    });

  }

  /**
   * This method is used to delete profile data from ui
   */
  deleteProfileData() {

    let arrId = []; // array to hold id of each selected profile to perform delete operation
    this.selectedProfile.map(function (each) {
      arrId.push(each.id)
    })

    this.profileTableData = this.profileTableData.filter(function (val) {
      return arrId.indexOf(val.id) == -1;  //value to be deleted should return false
    })

    /**** clearing object used for storing data */
    this.selectedProfile = [];
  }

  /**
    * This method is used to download/import the json file 
    * for the selected monitor profile.
    */
  importProfile(profile) {
    /***download file directly in server  */
    let url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;

    /***to download file in local */
    //let url = this.dataService.getserviceURL();
    console.log("url-----", url)

    this.profileService.downloadProfile(this.selectedTopology, profile.profileName, "netstorm").subscribe(data => {
      if (data) {
        let path = url + "/netstorm/temp/";
        path = path + profile.profileName + ".json";
        this.downloadURI(path, profile.profileName + ".json");
      }
    })
  }


  /** This method is used to make the download link to download the selected json file */
  downloadURI(uri, name) {
    var link = document.createElement("a");
    console.log("link--", link)

    link.download = name;
    link.href = uri;

    // Because firefox not executing the .click()
    // Hence, We need to create mouse event initialization.
    var clickEvent = document.createEvent("MouseEvent");
    clickEvent.initEvent("click", true, true);

    link.dispatchEvent(clickEvent);
  }

  exportProfile() {

  }

  /**
   * 
   */
  routeToConfiguration(profileName, selectedTopo) {
    console.log("Method routeToConfiguration called", profileName)
    console.log("selectedTopo-", selectedTopo)
    this.monConfServiceObj.clearData();
    this.monConfServiceObj.setProfileName(profileName);
    this.monConfServiceObj.setTopoName(selectedTopo);
    this.monConfServiceObj.setVariableInSession(0);
    this.router.navigate([URL.PROF_CONFIGURATION]);
  }

  //This method would be used in committing the monitor profile
  versionCommit(data) {
    try {
      this._dialogFileRef = this._dialog.open(CavScenVersionCommitComponent, {
        data: { monObj: this.setMonitorObj(data) }
      });

      this._dialogFileRef.afterClosed().subscribe(result => {
      });
    }
    catch (e) {
      console.error(e);
    }
  }
 
  //This method would be used in setting the monObj, for committing the monitor profile
  setMonitorObj(data) {
    return {
      isFromMon: true,
      topologyName: this.selectedTopology,
      profileName: data['profileName']
    }
  }

  versionLog($data) {
    try {
      this._dialogLogFileRef = this._dialog.open(CavScenVersionLogComponent, {
        data: { monObj: this.setMonitorObj($data) }
      });

      this._dialogLogFileRef.afterClosed().subscribe(result => {
      });
    }
    catch(e) {
      console.error(e);
    }
  }
 
  uploadFileMsg(event){
    this.messageService.successMessage("File uploaded Successfully");
    this.loadProfileData(this.selectedTopology);
     this.ngAfterViewInit();
  }

  /*This method is used to test monitor*/
  startTest(rowData)
  {
    console.log("startTest() method called ,rowData = ", rowData)
    this.confirmationService.confirm({
      message: COMPONENT.START_TEST_MSG  + " " + rowData.profileName + '?',
      header: 'Test Monitor Group Confirmation',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.profileService.testMonitorGroup(rowData, this.selectedTopology,  rowData.profileName, rowData.createdBy)
        .subscribe(res =>{
          console.log("res--- " , res)
                 /*This check is to see whether test is started successfully or not.*/
                 if (res.status == "fail")
                 {
                   this.messageService.errorMessage("Test monitor group failed");
                 }
                 else
                 {
                   this.showdialog = true;
                   this.testRunNumber = res.testRun;
                   this.messageService.successMessage("Test started successfully")
                 }
              });
            },

            reject: () => {
            }
          });
   
  }

  goToWebDashboard(trNum)
  {
   //  this.cavConfigService.$dashboardTestRun = testRunNum;
   //  this.navService.addNewNaviationLink('dashboard');
   //  this.router.navigate(['/home/dashboard']);
  }
}


