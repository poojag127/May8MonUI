import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cav-mon-dynamic-dependent-comp',
  templateUrl: './cav-mon-dynamic-dependent-comp.component.html',
  styleUrls: ['./cav-mon-dynamic-dependent-comp.component.css']
})

export class CavMonDynamicDependentCompComponent implements OnInit {

  @Input()
  dependentCompData: any[];

  @Input()
  disabled:boolean;

  @Output()
  updateTableVal = new EventEmitter();

  constructor() { }

  ngOnInit() 
  {
    console.log("Class DependentCompComponent called ")
  }

  updateTableValue(data)
  {
   console.log("in dynamic dependent comppp data--",data)
   this.updateTableVal.emit(data);
  }

}


