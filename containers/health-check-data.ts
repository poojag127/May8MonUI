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
 tierServerType:string;
 tierName:string;
 serverName:string;
 healthCheckType:string = "Ping";
 customTierName:string;
 customServerName:string;
 enableTier:boolean=false;
 enableServer:boolean = false;

}
