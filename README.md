# Smart Discount Allocation Engine

A TypeScript-based REST API built with Ts.ED framework for fair distribution of discount budgets among sales agents.

## Thought Process

### Algorithm Design
- **Fair Base Distribution**: 40% of kitty allocated equally to ensure everyone gets substantial minimum
- **Merit-Based Bonus**: 60% distributed based on composite performance score
- **Composite Scoring**: Weighted combination of performance (40%), target achievement (30%), seniority (20%), and active clients (10%)
- **Exact Allocation**: Remainder distributed to top performers to guarantee exact kitty usage

### Key Features
- ✅ **Normal Case**: Merit-based rewards for better performers
- ✅ **All-Same Case**: Equal distribution when scores are identical
- ✅ **Rounding Case**: Exact total allocation guaranteed
- ✅ **Fair Distribution**: No extreme disparities, substantial base for all

## Getting Started

> **Requirements:** Node >= 20.x and TypeScript >= 5

```bash
# Install dependencies
npm install

# Start server
npm run start
```

## Testing

Access Swagger UI at `http://localhost:8083/docs` for interactive API testing.

## API Usage

**Endpoint:** `POST /discount-allocation`

**Sample Request:**
```json
{
  "siteKitty": 10000,
  "salesAgents": [
    {
      "id": "A1",
      "performanceScore": 90,
      "seniorityMonths": 18,
      "targetAchievedPercent": 85,
      "activeClients": 12
    }
  ]
}
```

**Response:**
```json
{
  "allocations": [
    {
      "id": "A1",
      "assignedDiscount": 6000,
      "justification": "High performance across multiple metrics"
    }
  ]
}
```

