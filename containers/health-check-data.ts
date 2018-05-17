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
globalInterval:number = 200;
globalThreadPool:number = 5;
globalTimeOut:number = 0.2;
globalProxyUrl:string = "NA";
globalUserName:string;
gloabalPwd:string;
gloabalThrdPool:number = 10;
globalStatusCode:string;
}
