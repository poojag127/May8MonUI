import { Component, OnInit,Input} from '@angular/core';
import { UtilityService } from '../../../../services/utility.service';
import { SelectItem } from 'primeng/primeng';
import * as CHECK_MON_DROPDOWN_LIST from '../../../../constants/check-mon-dropdown-constants';
import * as COMPONENT from '../../../../constants/mon-component-constants';

@Component({
  selector: 'app-cav-check-monitor',
  templateUrl: './cav-check-monitor.component.html',
  styleUrls: ['./cav-check-monitor.component.css']
})
export class CavCheckMonitorComponent implements OnInit {

  @Input()
  item: Object;

  /*It stores options to be displayed in the execute first time from event dropdown*/
  executeTimeArr= [];

  /*It stores options to be displayed in the FREQUENCY dropdown*/
  freqArr= [];

 /*It stores options to be displayed in the END EVENT dropdown*/
  endEventArr= [];


  constructor(private utilityService:UtilityService) { }

  ngOnInit() 
  {
     /*This is used to create dropdown list for the dropdown elements*/
      this.createListForDropDown();
  }

  fromEventDropDownChange(item)
  {
    console.log("item =" ,item)
    if(item[COMPONENT.FROM_EVENT] == "1" || item[COMPONENT.FROM_EVENT] == "3")
    {
      item[COMPONENT.FREQUENCY] == "2";
    }
  }


 /*Method to create list for dropdown values */
 createListForDropDown()
 {
    /* To get dropdown list for FROM EVENT */
    this.executeTimeArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_LABEL, CHECK_MON_DROPDOWN_LIST.EXECUTE_TIME_VALUE);

    /* To get dropdown list for FREQUENCY */
    this.freqArr =  UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.FREQUENYCY_LABEL, CHECK_MON_DROPDOWN_LIST.FREQUENYCY_VALUE);
 
    /* To get dropdown list for END EVENT */
    this.endEventArr = UtilityService.createListWithKeyValue(CHECK_MON_DROPDOWN_LIST.END_EVENT_LABEL, CHECK_MON_DROPDOWN_LIST.END_EVENT_VALUE);
  }

}
