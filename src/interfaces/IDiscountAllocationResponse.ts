export interface IDiscountAllocationResponse {
  allocations: {
    id: string;
    assignedDiscount: number;
    justification: string;
  }[];
}