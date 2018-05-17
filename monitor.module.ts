import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
//import { MdDialog } from '@angular/material';
import { MaterialModule } from '@angular/material';

import { Md2Module } from 'md2';
import { Logger, Options as LoggerOptions, Level as LoggerLevel } from '../../../vendors/angular2-logger/core';


import { AccordionModule, DataTableModule, ContextMenuModule, MultiSelectModule, 
  ConfirmDialogModule, InputTextModule, ButtonModule, DialogModule, DropdownModule, FieldsetModule, RadioButtonModule,
  CheckboxModule, InputTextareaModule, TreeTableModule,SharedModule, FileUploadModule, PaginatorModule, PanelModule, SpinnerModule,
  GrowlModule,BreadcrumbModule,MessagesModule,ToolbarModule,ConfirmationService,TreeModule
} from 'primeng/primeng';

import { BlockUIModule } from 'ng-block-ui';
import { CavMonProfilesComponent } from './components/cav-mon-profiles/cav-mon-profiles.component';
import { CavMonConfigurationHomeComponent } from './components/cav-mon-configuration-home/cav-mon-configuration-home.component';
import { CavMonDynamicComponentsComponent } from './components/cav-mon-dynamic-components/cav-mon-dynamic-components.component';
import { CavMonDynamicTableComponent } from './components/cav-mon-dynamic-components/cav-mon-dynamic-table/cav-mon-dynamic-table.component';
import { CavMonDynamicDependentCompComponent } from './components/cav-mon-dynamic-components/cav-mon-dynamic-dependent-comp/cav-mon-dynamic-dependent-comp.component';
import { CavMonBreadcrumbComponent } from './components/cav-mon-breadcrumb/cav-mon-breadcrumb.component';
import { CavMonConfigurationComponent } from './components/cav-mon-configuration-home/cav-mon-configuration/cav-mon-configuration.component';
import { CavMonToolbarComponent } from './components/cav-mon-configuration-home/cav-mon-toolbar/cav-mon-toolbar.component';
import { CavMonStatsComponent } from './components/cav-mon-configuration-home/cav-mon-stats/cav-mon-stats.component';
import { CavMonHideShowComponent } from './components/cav-mon-configuration-home/cav-mon-hide-show/cav-mon-hide-show.component';
import { CavMonHomeComponent } from './components/cav-mon-home/cav-mon-home.component';
import { CavMonContentsComponent } from './components/cav-mon-contents/cav-mon-contents.component';
import { CavCheckMonitorComponent } from './components/cav-mon-configuration-home/cav-mon-configuration/cav-check-monitor/cav-check-monitor.component';
import { CavServerSignatureComponent} from './components/cav-mon-configuration-home/cav-mon-configuration/cav-server-signature/cav-server-signature.component';
 // import { CavMonRightPaneComponent } from './components/cav-mon-right-pane/cav-mon-right-pane.component';
 import { CavLogPatternMonitorComponent } from './components/cav-mon-configuration-home/cav-mon-configuration/cav-log-pattern-monitor/cav-log-pattern-monitor.component';
 import { CavMonHealthCheckComponent } from './components/cav-mon-configuration-home/cav-mon-health-check/cav-mon-health-check.component';

//services
import { MonDataService } from './services/mon-data.service';
import { MonProfileService } from './services/mon-profile.service';
import { RestApiService } from './services/rest-api.service';
import { UtilityService } from './services/utility.service';
import { MessageService } from './services/message.service';
import { MonConfigurationService } from './services/mon-configuration.service';
import { GdfService } from './services/gdf-services';
import { CavMonConfigurationRoutingComponent } from './components/cav-mon-configuration-home/cav-mon-configuration-routing/cav-mon-configuration-routing.component';
import { StoreModule } from '@ngrx/store';
import { MonHealthCheckService } from './services/mon-health-check-services';

//utility
// import { ColorCodeData } from './utility/color-code-data';

/** Routing Module */
import { MonitorRoutingModule } from './routes/monitor-routing.routes';

/**Reducer */
import { MonitorReducer } from './reducers/monitor-reducer';
import { MonitorCompReducer } from './reducers/monitor-comp-reducer';


// import { CavMonContentsComponent } from './components/cav-mon-contents/cav-mon-contents.component';


@NgModule({
  declarations: [
   
  CavMonProfilesComponent,
   
  CavMonConfigurationHomeComponent,
   
  CavMonDynamicComponentsComponent,
   
  CavMonBreadcrumbComponent,
   
  CavMonConfigurationComponent,
   
  CavMonToolbarComponent,
   
  CavMonStatsComponent,
   
  CavMonHideShowComponent,
  
  CavMonDynamicTableComponent,
   
  CavMonDynamicDependentCompComponent,
   
  CavMonConfigurationRoutingComponent,

  CavMonHomeComponent,


  CavMonContentsComponent,

  CavCheckMonitorComponent,

  CavServerSignatureComponent,
  CavLogPatternMonitorComponent,
  CavMonHealthCheckComponent
  
  ],
  
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    BlockUIModule,
    ContextMenuModule,
    MultiSelectModule,
    HttpModule,
    AccordionModule,
    DataTableModule,
    DropdownModule,
    InputTextModule,
    FieldsetModule,
    CheckboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    RadioButtonModule,
    Md2Module,
    MaterialModule,
    TreeTableModule,
    SharedModule,
    FileUploadModule, 
    PaginatorModule,
    SpinnerModule,
    MonitorRoutingModule,
    GrowlModule,
    BreadcrumbModule,
    MessagesModule,
    ToolbarModule,
    TreeModule,
    StoreModule.provideStore({ monitorData: MonitorReducer ,selectedMon:MonitorCompReducer}),
  ],
  providers: [
    { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } },
    Logger, MonDataService, MonProfileService, RestApiService, UtilityService, 
    MonConfigurationService, MessageService,ConfirmationService,
    GdfService,MonHealthCheckService
    
  ],

  /*Required for opening in model window. */
  entryComponents: [
    CavMonStatsComponent,
    CavMonHideShowComponent,
    CavMonHealthCheckComponent
  ],

  exports: [
  ],

  schemas: []
})

export class MonitorModule {
  constructor() {
  }
}
