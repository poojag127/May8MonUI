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
 pingIntrvl:number = 0.2;
 pingTP :number = 32;
 socketTo:number = 10;
 socketTP:string = "5";
 httpUrl:string ="NA";
 httpUser:string="NA";
 httpPwd:string ="NA";
 httpTP:number=64;
 httpSc:string= "2xx";
 httpTimeOut:number = 10;

  
}