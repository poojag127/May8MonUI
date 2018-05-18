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
 hostName:string;
 port:number;

globalPacket:number = 5;

 instName:string ="NA";
 pingPkt:number =5;
 pingIntrvl:number=10;
 sockeTo:number = 5;
 socketTP:string="5";
 httpUrl:string = "NA";
 httpUser:string = "NA";
 httpPwd:string ="NA";
 httpTP:number=5;
 httpSc:string ="301,302"; 
 arguments:string = "NA";

// globalInterval:number = 200;
// globalThreadPool:number = 5;
// globalTimeOut:number = 0.2;
// globalProxyUrl:string = "NA";
// globalUserName:string;
// gloabalPwd:string;
// gloabalThrdPool:number = 10;
// globalStatusCode:string;



}
