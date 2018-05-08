
import { MonConfigData } from './mon-config-data';



export interface TierConfigData
{
    tierName: MonConfigData;
    monMap : Map<String, MonConfigData>; 
    //monConfigData: MonConfigData;
}