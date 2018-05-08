export var logParserGDFKeyArgs = {
            "-p":"searchPattern",
            "graphName":"graphName",
            "-C":"unit"
}


export var getLogFileGDFKeyArgs = {
       
}

export class GetKeyForGDFArgs
{
  static getKeyByArg(arg,argKeyMap)
  {
    return logParserGDFKeyArgs[arg] == null ? arg :logParserGDFKeyArgs[arg];
  }
}