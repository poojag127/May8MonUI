import { Component, OnInit,Input} from '@angular/core';
import { CheckMonData } from '../../../../containers/check-monitor-data';
import { ActivatedRoute, Params } from '@angular/router';
import { UtilityService } from '../../../../services/utility.service';
import { SelectItem } from 'primeng/primeng';
import { ImmutableArray } from '../../../../utility/immutable-array';
import { MessageService } from '../../../../services/message.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { MonConfigurationService } from '../../../../services/mon-configuration.service';

@Component({
  selector: 'app-cav-server-signature',
  templateUrl: './cav-server-signature.component.html',
  styleUrls: ['./cav-server-signature.component.css']
})
export class CavServerSignatureComponent implements OnInit {

  @Input()
  item: Object;

  serverSignList:any[]=[];

  /*It stores selected check monitor data for EDIT/ADD  */
  checkMonFormData:CheckMonData;

  /*It stores configured check monitor table data */
  checkMonConfiguredData: CheckMonData[] = [];

  /*It stores selected configured check monitor data  */
  selectedCheckMonData: CheckMonData[];
 
  /*It stores tierId of each tier*/
  tierId: number;

  /*It stores monitor Name*/
  monName:string;

  /*It stores tierName of each tier*/
  tierName: string;

 /*It stores monitor group name */
  mjsonName:string;

  /*It stores topology name*/
  topoName:string;

  /*It stores options to be displayed in the execute first time from event dropdown*/
  executeTimeArr = [];

  /*It stores options to be displayed in the FREQUENCY dropdown*/
  freqArr= [];

 /*It stores options to be displayed in the END EVENT dropdown*/
  endEventArr= [];

  /*this flag variable is used for ADD/EDIT of the check monitor configuration*/
  isNewCheckMonConfig:boolean = true;
 
  /*It is used as counter for adding id to the tableData */
   count: number = 0;

  /*This variable is used to show the test run number */
  testRunNumber:number;
  
  /*This flag is used to display the dialog box for the generated test run number.
  * When user clicks on test monitor button then on successfull starting of the 
  * test a dialog box is generated showing the test run number to view the webdashboard.
  */
  showdialog:boolean =false;

  /*This flag is used to disable the fields as per the required condition*/
  disablePeriodicity: boolean = false;
  disableFreq:boolean = false;
  disablePhaseName:boolean = false;
  disableCount:boolean = false;
  disableEndEvent:boolean = false;
  changeToEndPhaseName: boolean = false;

  constructor(private route: ActivatedRoute,
              private utilityService:UtilityService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private monConfigurationService: MonConfigurationService,) { }

  ngOnInit() 
  {
    console.log("Class CavCheckMonitorComponenet Method ngOnInit = ",this.item)
    this.checkMonFormData = new CheckMonData();
    this.route.params.subscribe((params: Params) => {
      console.log("params--",params)
      this.topoName = params['topoName'];
      this.tierId = params['tierId'];
      this.monName = params['monName'];
      this.tierName = params['tierName'];
      this.mjsonName = params['mjsonName'];
    });

    let arrLabel = ['--Select Signature Type --','Command', 'File'];
    let arrValue = ['NA','Command','File']
    this.serverSignList = UtilityService.createListWithKeyValue(arrLabel,arrValue);

  }

   /*This method returns selected row on the basis of Id */
    getSelectedRowIndex(data): number 
    {
     let index = this.checkMonConfiguredData.findIndex(each => each["id"] == data)
       return index;
    }


  /*This method is called when user clicks on edit button*/
  openEditCheckMon(rowData)
  {   
     this.checkMonFormData = new CheckMonData();
     this.checkMonFormData = Object.assign({}, rowData)
  
     let that = this;
     this.isNewCheckMonConfig = false;
   }
}






