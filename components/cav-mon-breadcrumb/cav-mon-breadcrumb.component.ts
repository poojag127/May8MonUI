import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import * as BREADCRUMB from '../../constants/monconfig-breadcrumb-constant';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-cav-mon-breadcrumb',
  templateUrl: './cav-mon-breadcrumb.component.html',
  styleUrls: ['./cav-mon-breadcrumb.component.css']
})

export class CavMonBreadcrumbComponent implements OnInit {

  items: MenuItem[];
  home: MenuItem;
  breadcrumbSubscription: Subscription;
  constructor(private router: Router) { }

  ngOnInit() 
  {
     this.items = [{ routerLink: [BREADCRUMB.URL.HOME], label: BREADCRUMB.LABEL.HOME }];
     this.breadcrumbSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
     
      this.items = [{ routerLink: [BREADCRUMB.URL.HOME], label: BREADCRUMB.LABEL.HOME }];

      let url = event["url"];
      console.log("ConfigBreadcrumbComponent", "ngOnInit", "url ", url);

      console.log("BREADCRUMB.URL.CONFIGURATION--",BREADCRUMB.URL.CONFIGURATION)

      console.log("startnn--",url.startsWith(BREADCRUMB.URL.CONFIGURATION))

      if (url.startsWith(BREADCRUMB.URL.CONFIGURATION)) 
      {
        let arrURL = url.split("/");
        let topoName = '';
        let mjsonName='';
        this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION , routerLink: [`${BREADCRUMB.URL.CONFIGURATION}`]});
        console.log("ConfigBreadcrumbComponent", "ngOnInit", "arrURL ", arrURL);
        console.log("configuration icon--",BREADCRUMB.URL.CONFIGURATION_HOME)
        if(url.startsWith(BREADCRUMB.URL.CONFIGURATION_HOME))
        {
         this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION});
        }
        // else if(url.startsWith(BREADCRUMB.URL.WEBLOGIC_CONFIGURATION))
        // {
        //   // url--- /mjson/advanceSettings/poo/mosaic_stress_as1/Weblogic/All_Tier
        //  topoName = arrURL[4];
        //  mjsonName = arrURL[3];
        //  console.log("ConfigBreadcrumbComponent", "ngOnInit", "mjsonName ", mjsonName);
        // //  this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION , routerLink: [`${BREADCRUMB.URL.CONFIGURATION_HOME}/${mjsonName}/${topoName}`]});
        //  this.items.push({ label: BREADCRUMB.LABEL.WEBLOGIC_CONFIGURATION});
        // }
        else if(url.startsWith(BREADCRUMB.URL.ADVANCE_CONFIGURATION))
        {
          console.log("arrURL--",arrURL)
          console.log("lenhth of arrUrl--",arrURL.length)
          topoName = arrURL[4];
          mjsonName = arrURL[3];

          this.items.push({ label: BREADCRUMB.LABEL.CONFIGURATION_HOME });
          
        }
      }
     this.home = {icon: 'fa fa-home'};
  });
}

  ngOnDestroy() {
    if (this.breadcrumbSubscription)
      this.breadcrumbSubscription.unsubscribe();
  }
}
