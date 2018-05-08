export class MonGroupInfoData {
  meta: string;
  graph: groupGraphData[];
  group: string;
  desc: string;
}

export interface groupGraphData {
  gname: string;
  desc: string;
}