import { HcPingProperties } from './hc-ping-properties';
import { HCSocketProperties } from './hc-socket-properties';
import { HCHttpProperties }  from './hc-http-properties';
 
export class GlobalProps
{
 pingPkt:number;
 pingIntrvl:number;
 sockeTo:number;
 socketTP:string;
 httpUrl:string;
 httpUser:string;
 httpPwd:string;
 httpTP:number=5;
 httpSc:string; 
}