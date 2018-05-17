export class HealthCheckMonData
{
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
globalInterval:number;


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
