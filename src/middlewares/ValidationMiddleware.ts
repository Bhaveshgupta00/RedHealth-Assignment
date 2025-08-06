import { Middleware, MiddlewareMethods } from "@tsed/platform-middlewares";
import { Context } from "@tsed/platform-params";
import { BadRequest } from "@tsed/exceptions";

@Middleware()
export class ValidationMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {
    const body = ctx.request.body;

    if (!body || Object.keys(body).length === 0) {
      throw new BadRequest("Request body is required");
    }

    if (typeof body.siteKitty !== "number" || body.siteKitty <= 0) {
      throw new BadRequest("siteKitty must be a positive number");
    }

    if (!Array.isArray(body.salesAgents) || body.salesAgents.length === 0) {
      throw new BadRequest("salesAgents must be a non-empty array");
    }

    for (const agent of body.salesAgents) {
      if (!agent.id || typeof agent.id !== "string") {
        throw new BadRequest("Each agent must have a valid id");
      }
      
      if (typeof agent.performanceScore !== "number" || agent.performanceScore < 0 || agent.performanceScore > 100) {
        throw new BadRequest("performanceScore must be between 0 and 100");
      }
      
      if (typeof agent.seniorityMonths !== "number" || agent.seniorityMonths < 0) {
        throw new BadRequest("seniorityMonths must be a non-negative number");
      }
      
      if (typeof agent.targetAchievedPercent !== "number" || agent.targetAchievedPercent < 0 || agent.targetAchievedPercent > 100) {
        throw new BadRequest("targetAchievedPercent must be between 0 and 100");
      }
      
      if (typeof agent.activeClients !== "number" || agent.activeClients < 0) {
        throw new BadRequest("activeClients must be a non-negative number");
      }
    }
  }
}