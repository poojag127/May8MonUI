import * as COLOR_CODE from '../constants/colorcode-constants';
//  let colorCodeMap = { '-1':'white',
//                        '0' :'white',
//                        '1':'white',
//                        '2':'grey',
//                        '3':'grey',
//                        '4':'green',
//                        '5':'red',
//                        '6':'green',
//                        '7':'green'
//                  }
let colorCodeMap = {  [COLOR_CODE.PARENT_NODE] :'white',
                      [COLOR_CODE.UNCHECKED_COMPNOPRESENT_NOTCONFIGURED] :'white',
                      [COLOR_CODE.UNCHECKED_COMPPRESENT_NOTCONFIGURED] :'white',
                      [COLOR_CODE.UNCHECKED_COMPPRESENT_ISCONFIGURED]:'grey',
                      [COLOR_CODE.UNCHECKED_COMPNOPRESENT_ISCONFIGURED]:'grey',
                      [COLOR_CODE.CHECKED_COMPNOPRESENT_NOTCONFIGURED]:'green',
                      [COLOR_CODE.CHECKED_COMPPRESENT_NOTCONFIGURED]:'red',
                      [COLOR_CODE.CHECKED_COMPPRESENT_ISCONFIGURED]:'green',
                      [COLOR_CODE.CHECKED_COMPNOPRESENT_ISCONFIGURED]:'green'
                 }



 
 export class ColorCodeData
 {
 //to add data in table
    static getColor(mode) {
        console.log("mode",mode)
        console.log("colorName----",colorCodeMap)
        return colorCodeMap[mode] == null ? 'white' :colorCodeMap[mode];
    }
}
