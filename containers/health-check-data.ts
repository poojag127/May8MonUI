export class HealthCheckMonData
{
 prop :any= {};
 packet:number =5;
 interval:number ;
 proxyUrl:string = "NA";
 userName:string = "cavisson";
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

 globalPacket:number = 5;

 instName:string ='';
 pingPkt:number =5;
 pingIntrvl:number=10;
 sockeTo:number = 10;
 socketTP:string="5";
 httpUrl:string= "";
 httpUser:string= "";
 httpPwd:string= "";
 httpCnfrmPwd:string = "";
 httpTP:number=5;
 httpSc:string ="2xx"; 
 arguments:string = "false";


useProxy:boolean= false;
overideGlobalSettings:boolean = false;
instNameHttp:string;
enableHealthCheckMon:boolean;

url:string='';
user:string;

httpCTO:number = 10;
httpRTO:number = 30;
}
