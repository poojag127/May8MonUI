export class HealthCheckMonData
{
 packet:number =5;
 interval:number ;
 proxyUrl:string;
 userName:string;
 pwd:string;
 statusCode:string;
 threadPool:number;
 timeOut:number;
 tierServerType:string;
 tierName:string;
 serverName:string;
 healthCheckType:string = "Ping";
}