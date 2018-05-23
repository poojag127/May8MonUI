export class HealthCheckMonData
{
 prop :any= {};
 packet:number;
 interval:number ;
 proxyUrl:string;
 userName:string;
 pwd:string;
 statusCode:string;
 threadPool:number;
 timeOut:number;
 tierServerType:string = "";
 tierName:string = "";
 serverName:string = "";
 healthCheckType:string = "Ping";
 customTierName:string;
 customServerName:string;
 enableTier:boolean=false;
 enableServer:boolean = false;
 instanceName:string;
 host:string;
 port:number;


 instName:string ='';

 pingPkt:number;
 pingIntrvl:number;
 sockeTo:number;
 socketTP:string;
 httpUrl:string;
 httpUser:string;
 httpPwd:string;
 httpTP:number;
 httpSc:string; 
 arguments:string = "false";


useProxy:boolean= false;
overideGlobalSettings:boolean = false;
instNameHttp:string;
enableHealthCheckMon:boolean;

url:string;
user:string;

httpCTO:number;
httpRTO:number;
}
