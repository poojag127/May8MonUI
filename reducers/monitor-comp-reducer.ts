// import { cloneObject } from '../utility/monconfig-utility';
import { ActionReducer, Action } from '@ngrx/store';
import * as _ from "lodash";
import {cloneObject} from '../services/utility.service';

export const SELECTED_MON = "selectedMon";

const initialState = {data:[],
                      configuredData:[],
                      configuredUIData:[]
                     
                   };

/**
 *  This function updates the component's value of type table used basically for
 *  edit purpose
 * @param newState 
 * @param tableObj 
 */

  function  getTableData(newState,tableObj)
  {
    console.log("getTableData method called")
    let id = tableObj["id"];
    let compData = newState;
    for(let i = 0;i < compData.length; i++)
    {
      if(compData[i]["id"] == id)
      {
       compData[i]["value"] = tableObj["value"]
       break; 
      }
      else if(compData[i]["dependentComp"] != null)
         getTableData(compData[i]["dependentComp"],tableObj)
     
     else if(compData[i]["items"] != null)
         getTableData(compData[i]["items"],tableObj)
    }
  }  

 export function MonitorCompReducer(state:{}, action: Action) {
    console.log("reducer called--method comp reducer--",action)
    switch (action.type) {
       case "ADD_COMPONENTS_DATA":  //same reducer called 
            console.log("action.payload", action.payload);
            var newState = Object.assign({}, state);
            console.log("newState in add componnets reducer--",newState)
            newState["data"]= action.payload.data;
            console.log("newState--in selecte mon reducer--",newState)
            return cloneObject(newState);

       case "UPDATE_TABLECOMP_VALUE":
          var newState = Object.assign({}, state);
          console.log("Reducer UPDATE_TABLECOMP_VALUE called")
          getTableData(newState["data"],action.payload);
          return cloneObject(newState);


        case "CONFIGURED_MONDATA":
         var newState = Object.assign({},state);
         console.log("CONFIGURED_MONDA{TA switch case=----------",newState)
         let tierObj = [],tierUIObj = [];
         let monObj = [];
         let tierName = action.payload.tier;
         let monName = action.payload.monName;
         let data = action.payload.data;
        //  var newData = _.map(data, function(o) { return _.omit(o, 'arguments'); });

         let configureUIData = newState["configuredUIData"];
         tierUIObj = _.find(configureUIData,function(each) { return each.hasOwnProperty(tierName)})
         if(tierUIObj == null)
         {
           let obj = {[tierName]:[{[monName]:data}]};
           if(configureUIData == null)
             configureUIData = [];

           configureUIData.push(obj);
         }
         else{
             tierUIObj[tierName] = data;
         }
         console.log("configureUIData--",configureUIData)

         /*******For server side data***********/         
         console.log("action.payload data--",action.payload)
         let configuredData = newState["configuredData"];
         tierObj = _.find(configuredData,function(each) { return each.hasOwnProperty(tierName)})
        //  console.log("tierObj--",tierObj)
         if(tierObj == null )
         {
           let obj = {[tierName]:[{[monName]:data}]};
           if(configuredData == null)
              configuredData = [];
              
           configuredData.push(obj);
         }
         else
         {
           monObj =  _.find(tierObj,function(each) { return each.hasOwnProperty(monName)})
           monObj[monName] = data;
         }
         console.log("configuredData--",configuredData)
         console.log("monObj--",monObj)

         newState["configuredUIData"]=configureUIData ;
         newState["configuredData"] = configuredData;
         console.log("newState--",newState)
         return cloneObject(newState);
           
        default:
            // returns {}};

        
    }
}