export class HealthCheckMonData
{
 prop :any= {};
 packet:number =5;
 interval:number ;
 proxyUrl:string = "NA";
 userName:string = "cavisson";
 pwd:string ="NA";
 statusCode:string;
 threadPool:number;
 timeOut:number;
 tierServerType:string = "";
 tierName:string = "";
 serverName:string;
 healthCheckType:string = "Ping";
 customTierName:string;
 customServerName:string;
 enableTier:boolean=false;
 enableServer:boolean = false;
 instanceName:string;
 host:string;
 port:number;

 globalPacket:number = 5;

 instName:string ;
 pingPkt:number =5;
 pingIntrvl:number=10;
 sockeTo:number = 10;
 socketTP:string="5";
 httpUrl:string = "NA";
 httpUser:string = "NA";
 httpPwd:string ="NA";
 httpCnfrmPwd:string;
 httpTP:number=5;
 httpSc:string ="301,302"; 
 arguments:string = "false";


useProxy:boolean= false;
overideGlobalSettings:boolean = false;
instNameHttp:string;
enableHealthCheckMon:boolean = false;

url:string='';
user:string;

}
