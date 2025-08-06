import { Injectable } from "@tsed/di";
import { IAllocationResult } from "src/interfaces/IAllocationResult.js";
import { ISalesAgent } from "src/interfaces/ISalesAgent.js";

@Injectable()
export class DiscountAllocationService {
  /**
   * Allocates discount budget among sales agents using 40% base + 60% merit distribution
   * @param siteKitty Total discount budget to allocate
   * @param salesAgents Array of sales agents with performance data
   * @returns Array of allocation results with assigned amounts and justifications
   */

  public allocateDiscount(siteKitty: number, salesAgents: ISalesAgent[]): IAllocationResult[] {
    if (!salesAgents.length) return [];

    const baseAmount = Math.floor(siteKitty * 0.4 / salesAgents.length);
    const bonusPool = siteKitty - (baseAmount * salesAgents.length);
    const scores = salesAgents.map(agent => this.calculateCompositeScore(agent));

    const allocations = this.createInitialAllocations(salesAgents, scores, baseAmount, bonusPool);
    this.distributeRemainder(siteKitty, allocations, scores);

    return allocations;
  }

  /**
   * Creates initial allocations combining base amount with performance-based bonus
   * @param salesAgents Array of sales agents
   * @param scores Calculated composite scores for each agent
   * @param baseAmount Fixed base allocation per agent
   * @param bonusPool Remaining budget for performance-based distribution
   * @returns Initial allocation results before remainder distribution
   */

  public createInitialAllocations(salesAgents: ISalesAgent[], scores: number[], baseAmount: number, bonusPool: number): IAllocationResult[] {
    const totalScore = scores.reduce((sum, score) => sum + score, 0);

    return salesAgents.map((agent, i) => {
      const bonusAmount = totalScore > 0 ? Math.floor(bonusPool * scores[i] / totalScore) : Math.floor(bonusPool / salesAgents.length);
      return {
        id: agent.id,
        assignedDiscount: baseAmount + bonusAmount,
        justification: this.generateJustification(scores[i], totalScore > 0)
      };
    });
  }

  /**
   * Distributes remainder from rounding to top performers to ensure exact kitty usage
   * @param siteKitty Original total budget
   * @param allocations Current allocation results to modify
   * @param scores Performance scores for ranking agents
   */

  public distributeRemainder(siteKitty: number, allocations: IAllocationResult[], scores: number[]): void {
    const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.assignedDiscount, 0);
    const remainder = siteKitty - totalAllocated;

    if (remainder > 0) {
      const sortedIndices = scores.map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.index);

      for (let i = 0; i < remainder; i++) {
        allocations[sortedIndices[i % sortedIndices.length]].assignedDiscount++;
      }
    }
  }

  /**
   * Calculates weighted composite score: performance(40%) + target(30%) + seniority(20%) + clients(10%)
   * @param agent Sales agent with performance metrics
   * @returns Normalized composite score between 0-1
   */

  public calculateCompositeScore(agent: ISalesAgent): number {
    const normalizedPerformance = agent.performanceScore / 100;
    const normalizedSeniority = Math.min(agent.seniorityMonths / 60, 1);
    const normalizedTarget = agent.targetAchievedPercent / 100;
    const normalizedClients = Math.min(agent.activeClients / 20, 1);

    return (normalizedPerformance * 0.4) + (normalizedTarget * 0.3) + (normalizedSeniority * 0.2) + (normalizedClients * 0.1);
  }

  /**
   * Generates human-readable justification based on performance level
   * @param score Composite performance score
   * @param hasVariation Whether agents have different performance levels
   * @returns Justification message for the allocation
   */
  
  public generateJustification(score: number, hasVariation: boolean): string {
    if (!hasVariation) return "Equal distribution due to identical performance metrics";

    if (score > 0.7) return "High performance across multiple metrics";
    if (score > 0.5) return "Good overall performance with room for growth";
    return "Developing performance with base allocation";
  }
}