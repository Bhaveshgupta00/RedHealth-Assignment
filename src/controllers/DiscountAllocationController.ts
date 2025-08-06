import { Controller, Inject } from "@tsed/di";
import { Post, Returns } from "@tsed/schema";
import { DiscountAllocationService } from "../services/DiscountAllocationService.js";
import { ValidationMiddleware } from "../middlewares/ValidationMiddleware.js";
import { Use } from "@tsed/platform-middlewares";
import { BodyParams } from "@tsed/platform-params";
import { InternalServerError } from "@tsed/exceptions";
import { DiscountAllocationRequest } from "../interfaces/IDiscountAllocationRequest.js";

@Controller("/discount-allocation")
export class DiscountAllocationController {
  @Inject()
  private discountService: DiscountAllocationService;
  @(Returns(200).Description('Success'))
  @(Returns(500, InternalServerError).Description('Error in getting allocated discount and performance details'))
  @Post("/")
  @Use(ValidationMiddleware)
  public allocateDiscount(@BodyParams() request: DiscountAllocationRequest): { allocations: any[] } {
    const allocations = this.discountService.allocateDiscount(
      request.siteKitty,
      request.salesAgents
    );
    
    return { allocations };
  }
}