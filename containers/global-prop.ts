import { HcPingProperties } from './hc-ping-properties';
import { HCSocketProperties } from './hc-socket-properties';
import { HCHttpProperties }  from './hc-http-properties';
 
export class GlobalProps
{
//  prop:any={};
 instName:string = "NA";
 host:string= "NA";
 arguments:string = "NA";
 pingPkt:number =5;
 pingIntrvl:number =10;
 sockeTo:number =5;
 socketTP:string = "5";
 httpUrl:string ="NA";
 httpUser:string="cavisson";
 httpPwd:string ="cavisson";
 httpTP:number=5;
 httpSc:string="301,302,303"; 
  
}