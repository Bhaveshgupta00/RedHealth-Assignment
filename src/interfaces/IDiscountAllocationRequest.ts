import { CollectionOf, Property } from "@tsed/schema";
import { ISalesAgent } from "./ISalesAgent.js";
import { IDiscountAllocationRequest } from "src/models/DiscountAllocationRequest.js";

export class SalesAgent {
  @Property()
  id: string;
  
  @Property()
  performanceScore: number;
  
  @Property()
  seniorityMonths: number;
  
  @Property()
  targetAchievedPercent: number;
  
  @Property()
  activeClients: number;
}

export class DiscountAllocationRequest implements IDiscountAllocationRequest {
  @Property()
  siteKitty: number;
  
  @CollectionOf(SalesAgent)
  salesAgents: ISalesAgent[];
}