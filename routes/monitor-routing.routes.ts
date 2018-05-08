import { CavMonProfilesComponent } from '../components/cav-mon-profiles/cav-mon-profiles.component';
import { CavMonConfigurationHomeComponent } from '../components/cav-mon-configuration-home/cav-mon-configuration-home.component';
import { CavMonConfigurationComponent } from '../components/cav-mon-configuration-home/cav-mon-configuration/cav-mon-configuration.component';
import { CavMonConfigurationRoutingComponent } from '../components/cav-mon-configuration-home/cav-mon-configuration-routing/cav-mon-configuration-routing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CavMonHomeComponent } from '../components/cav-mon-home/cav-mon-home.component';

  
 const MONITOR_ROUTING: Routes = [

    { path: '', component: CavMonHomeComponent ,children:[
    { path: '', redirectTo:'home', pathMatch: 'full' },
    { path:'home',component:CavMonProfilesComponent},
    { path:'configuration', component: CavMonConfigurationRoutingComponent, children: [
      { path:'', redirectTo:'configuration', pathMatch: 'full' },
      { path:'configuration', component:CavMonConfigurationHomeComponent },
      { path:'monConfiguration/:mjsonName/:topoName/:monName/:tierId/:tierName', component: CavMonConfigurationComponent }
    ]
  }
 ]
}
];

@NgModule({
    imports: [RouterModule.forChild(MONITOR_ROUTING)],
    // imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class MonitorRoutingModule {

}
