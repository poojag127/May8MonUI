

//for running monUI as a standAlone
// export const ROUTING_PATH: string = "";


/* for running monUI with ProductUI*/
 
 
 export const ROUTING_PATH: string = "/home/monitor";

export const GET_TIER_LIST = `getTiers`;

/*service Url for Home Screen */
export const GET_TOPO_LIST = `getListOfTopology`;
export const GET_PROFILE_LIST = `getProfileListFromTopo/`;
export const DEL_PROFILE = `deleteProfile`; // url to delete profiles from the home screen
export const IMPORT_PROFILE = `downloadProfile`;//url  for downloading profile 
export const TEST_MONITOR_GROUP = `testMonitorGroup`; // url for starting test for a monitor group

export const GET_SERVER_LIST = `getServerList`; 

/** Url for configuration Home Screen */
export const GET_MONITORS_DATA = `getMonitorsData`;
export const GET_TIER_MONITORS_DATA = `getTreeTableData`; 
export const GET_CHILD_NODES = `getChildNodesDataByCategoryName`;
export const GET_COMPONENTS = `getComponentByMon`;


/**Url for saving monitor Data ****/
export const SAVE_DATA = `saveProfile`;

/**Url for getting monitor data *****/
export const GET_MON_CONFIGURED_DATA = `getMonDataByTier`;


/*Component URL constants */
export const PROF_CONFIGURATION = "/home/monitor/configuration"; 
export const MON_CONFIGURATION = "/home/monitor/configuration/monConfiguration"; 

export const GET_MONITORS_STATS = `getMonitorStats`;
export const GET_MONITORS_STATS_LIST = 'getMonitorStatsList';

export const GET_MONITORS_CONFIG = "getMonConfigurationData";

/*Url for testing monitor */
export const TEST_MONITOR = "testMonitor";
export const HIDE_MONITORS = "updateMonitorMode";
export const SHOW_HIDDEN_MON= "getHiddenMonitorList";

/*Url for getting gdf list according to monitor type */
export const GET_GDF_LIST = `getListOfGdf`;