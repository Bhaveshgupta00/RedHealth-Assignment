export interface ISalesAgent {
  id: string;
  performanceScore: number;
  seniorityMonths: number;
  targetAchievedPercent: number;
  activeClients: number;
}

export interface IDiscountAllocationRequest {
  siteKitty: number;
  salesAgents: ISalesAgent[];
}
