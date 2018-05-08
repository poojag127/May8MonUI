import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import {Message, ConfirmationService} from 'primeng/primeng';
import { MonDataService } from '../../services/mon-data.service';


@Component({
  selector: 'app-cav-mon-home',
  templateUrl: './cav-mon-home.component.html', 
  styleUrls: ['./cav-mon-home.component.css']
})
export class CavMonHomeComponent implements OnInit {

  constructor(private messageService: MessageService, private _monConfigService: MonDataService) { }
  
  isProgressBar: boolean = false;
  color: string = "primary";
  calcheight : String = "340px";
  message: Message[] = [];

  ngOnInit() {

    this._monConfigService.initConfiguration();

    this.messageService.messageProvider$.subscribe(data=> this.message = data);
  
    this.messageService.progressBarProvider$.subscribe(flag=> {
      //For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
      setTimeout(()=>{
        this.isProgressBar = flag["flag"];
        this.color = flag["color"];
      }, 1);
      
    });
      this.calcheight = window.innerHeight - 104 + "px";	
  }






}
