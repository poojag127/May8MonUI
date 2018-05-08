import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cav-mon-dynamic-components',
  templateUrl: './cav-mon-dynamic-components.component.html',
  styleUrls: ['./cav-mon-dynamic-components.component.css']
})
export class CavMonDynamicComponentsComponent implements OnInit {

  @Input()
  item: Object;

  @Input()
  disabled: boolean;

  @Output()
  updateTableVal = new EventEmitter();

  constructor() { } 

  ngOnInit() {
    console.log("Class RenderCompComponent called ")
    if (this.item["type"] == 'Checkbox')
      this.item["value"] = this.item["value"] == "true"
  }

  /**
   * This method used to send data to parent componnet monitors.component
   * @param data 
   */

  updateTableValue(data) {
    console.log("renderCompData Method Called tableData--", data)
    this.updateTableVal.emit(data)
  }
}
