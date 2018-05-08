import { ActionReducer, Action } from '@ngrx/store';
import {cloneObject} from '../services/utility.service';
import * as _ from "lodash";

export const MONITOR_DATA = "monitorData";

const initialState = {
                   };
  
//Default Keyword data.
const DEFAULT_DATA = { 
 "weblogic":{'JDBCStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'JVMStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'ThreadPoolStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'SessionStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'JMSQueueStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'MinThreadConstraintStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}],
            'TransactionStats':[{'tierName':'All Tier','monName':'WeblogicJdbcStats','enable':false,'hostName':'127.0.0.1','port':'17000','userName':'weblogic','pwd':'weblogic','mBeanType':'JMSDestinationRuntimeMBean','instanceName':''}]
          }
}

 export function MonitorReducer(state:{}, action: Action) {
   console.log("reducer called--",action)
   switch (action.type) {
     case "MONITOR_DATA":
       console.log("action.payload", action.payload);
       console.log("DEFAULT_DATA",DEFAULT_DATA)
       var newState = Object.assign({}, state);
       newState["data"] = action.payload
       return cloneObject(newState);

     case "ADD_MONITOR_DATA":
       var newState = Object.assign({}, state);
       let treeTableData = newState["data"]["treeTableData"]["data"];
       let nodeData = _.find(treeTableData, function(each) { return each['data']['monitor'] == action.payload.categoryName});
       console.log("action.payload--",action.payload)
       nodeData['children'] = action.payload.data;
       console.log("newState--",newState)
       return cloneObject(newState);


      // case "ADD_COMPONENTS_DATA":
      //  var newState = Object.assign({}, state);
      //  console.log("newState-- in ADD_COMPONENTS_DATA switch case-p-",newState);
      //  console.log("newState---",newState)
      //  let tableData = newState["data"]["treeTableData"]["data"];
      //  console.log("tableData--",tableData)
      //  console.log("actin.payload--",action.payload)
      //  let id = action.payload["id"];
      //  let arrId = id.split(".");

      // /***getting parent  Node if selected node is any of the child node ****/
      //  let rowData = _.find(tableData, function(each) { return each['data']['id'] == arrId[0]});

      //  if(arrId.length > 1)
      //  {
      //   let childNodes = rowData["children"];
      //   console.log("childNodes--",childNodes)
      //   rowData = _.find(childNodes, function(each) { return each['data']['id'] == id});
      //  }
      //  console.log("rowData---",rowData)
      //  rowData["compArgsJson"] = action.payload.data; 
      //  console.log("newState--",newState)
      //  return newState;

      //  case "SELECTED_MON":
      //   console.log("action.payload", action.payload);
      //   var newState = Object.assign({}, state);
      //   console.log("newState-selected monitor-p--",newState)
      //   let data  = newState["data"]["treeTableData"]["data"];
      //   let selectedMon =  _.find(data, function(each) { return each['data']['monitor'] == action.payload.monitor});
      //   newState["selectedMon"] = selectedMon['compArgsJson'];
      //   console.log("newState--",newState)
      //   return cloneObject(newState);

       default:
            // returns DEFAULT_DATA;

        
    }
}