import * as COMPONENT from './mon-component-constants';

export const chkMonHdrList = [
        { field: COMPONENT.NAME, header: 'Check Monitor Name' },
        { field: COMPONENT.FROM_EVENT, header: 'COMPONENT.FROM_EVENT' ,isHidden:true},
        { field: COMPONENT.PHASE_NAME, header: 'Phase Name' },
        { field: COMPONENT.FREQUENCY, header: 'COMPONENT.FREQUENCY' ,isHidden:true},
        { field: COMPONENT.PERIODICITY, header: 'Periodicity' },
        { field: COMPONENT.END_EVENT, header: ' COMPONENT.END_EVENT' ,isHidden:true},
        { field: COMPONENT.COUNT, header: 'Count' },
        { field: COMPONENT.END_PHASE_NAME, header: 'End Phase Name' },
        { field: COMPONENT.CHECK_MON_PROG_NAME, header: 'Check Monitor Program Name' ,isUrlEncode:true},
        { field: COMPONENT.FROM_EVENT_UI, header: 'From Event' },
        { field: COMPONENT.FREQUENCY_UI, header: 'Frequency'},
        { field: COMPONENT.END_EVENT_UI, header: 'End Event'}
      ];


export const serverSignatureHdrList = [
      { field :COMPONENT.NAME , header: 'Server Signature Name'},
      { field :COMPONENT.SIGN_TYPE , header : 'Server Sigature Type'},
      { field : COMPONENT.CMDFILE_NAME , header : 'Command / File Name' ,isUrlEncode:true}
]

export const logPatternMonList = [
      {field : COMPONENT.NAME , header: 'Log Pattern Monitor Name'},
      {field : COMPONENT.GDF_NAME,header: 'Gdf Name'},
      {field:  COMPONENT.RUN_OPTIONS, header: 'COMPONENT.RUN_OPTIONS' ,isHidden:true},
      {field : COMPONENT.METRIC ,header :"Metric"},
      {field : COMPONENT.LOG_FILE_NAME ,header:"File Name"},
      {field : COMPONENT.SEARCH_PATTERN ,header:"Search Pattern to fetch Access Log"},
      {field : COMPONENT.INSTANCE ,header: "Instance Name"},
      {field : COMPONENT.RUN_OPTIONS_UI, header :'Run Options'},
]
