import { HcPingProperties } from './hc-ping-properties';
import { HCSocketProperties } from './hc-socket-properties';
import { HCHttpProperties }  from './hc-http-properties';
 
export class GlobalProps
{
//  prop:any={};
 instName:string = "NA";
 host:string= "NA";
 url:string ="NA";
 user:string ="NA";
 pwd:string="NA";
 arguments:string = "NA";
 pingPkt:number =3;   
 pingIntrvl:number = 10;
 pingTP :number = 32;
 sockeTo:number = 10;
 socketTP:string = "5";
 httpUrl:string ="NA";
 httpUser:string="NA";
 httpPwd:string ="NA";
 httpTP:number=64;
 httpSc:string= "2xx";
 httpCTO:number = 10;
 httpRTO:number = 30;

  
}