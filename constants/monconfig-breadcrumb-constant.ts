import { ROUTING_PATH } from './mon-url-constants';

export const LABEL = {
    HOME: 'Monitor Group',
    CONFIGURATION:'Configuration',
    CONFIGURATION_HOME:'Monitor Configuration',
    WEBLOGIC_CONFIGURATION:'WeblogicConfigure',
    ADVANCE_CONFIGURATION:'monConfiguration'
} 

export const URL = {
    HOME: `${ROUTING_PATH}/home`,
    CONFIGURATION: `${ROUTING_PATH}/configuration`,
    CONFIGURATION_HOME: `${ROUTING_PATH}/configuration/configuration`,
    WEBLOGIC_CONFIGURATION:`${ROUTING_PATH}/configuration/weblogicSettings`,
    ADVANCE_CONFIGURATION:`${ROUTING_PATH}/configuration/monConfiguration`
};  
