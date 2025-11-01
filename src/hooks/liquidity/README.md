# Liquidity Hooks Refactoring

## Overview

This directory contains the refactored liquidity management hooks, split from the original 1,868-line `useUniswapV2Liquidity.ts` into focused, maintainable modules.

## Architecture

### Module Breakdown

```
src/hooks/liquidity/
├── README.md                      # This file
├── index.ts                       # Main export that composes all modules
├── types.ts                       # Shared TypeScript interfaces
├── useAddLiquidity.ts            # Add liquidity operations
├── useRemoveLiquidity.ts         # Remove liquidity operations
├── useLiquidityState.ts          # Core state management
├── useLiquidityStorage.ts        # localStorage persistence
├── useLiquidityValidation.ts     # Validation logic
└── utils.ts                       # Shared utility functions
```

### Responsibilities

#### `types.ts`
- LP token interface
- Pool data interface
- Transaction status types
- Error types specific to liquidity operations

#### `useAddLiquidity.ts` (~300-400 lines)
- Add liquidity transaction logic
- Token approval for adding liquidity
- Slippage calculations
- Success/failure handling
- Transaction monitoring

#### `useRemoveLiquidity.ts` (~300-400 lines)
- Remove liquidity transaction logic
- LP token approval
- Minimum amount calculations
- Transaction monitoring
- Pool exit logic

#### `useLiquidityState.ts` (~200-300 lines)
- Current transaction hash tracking
- Loading states (approving, adding, removing)
- Error state management
- Transaction step tracking
- Pool data state

#### `useLiquidityStorage.ts` (~150-200 lines)
- Save LP tokens to localStorage
- Load user's LP tokens
- Update pool data in storage
- Remove pools from storage
- Migration logic for old data formats

#### `useLiquidityValidation.ts` (~200-300 lines)
- Validate token amounts
- Check allowances
- Validate pool existence
- Balance checks
- Input sanitization

#### `utils.ts` (~100-150 lines)
- Calculate deadline timestamps
- Parse pool data from receipts
- Format amounts for display
- Error message helpers
- ABI constants

#### `index.ts` (~100-200 lines)
Main composition hook that:
- Combines all sub-hooks
- Provides unified API matching original hook
- Maintains backward compatibility
- Exports all functionality

## Migration Strategy

### Phase 1: Extract Utilities and Types ✅
1. Create `types.ts` with all interfaces
2. Create `utils.ts` with helper functions
3. No breaking changes

### Phase 2: Extract Storage Logic
1. Move localStorage operations to `useLiquidityStorage.ts`
2. Import in main hook
3. Test storage operations work correctly

### Phase 3: Extract Validation
1. Move validation logic to `useLiquidityValidation.ts`
2. Import and use in main hook
3. Test all validation scenarios

### Phase 4: Extract Add Liquidity
1. Move add liquidity logic to `useAddLiquidity.ts`
2. Ensure all dependencies are imported
3. Test add liquidity flow end-to-end

### Phase 5: Extract Remove Liquidity
1. Move remove liquidity logic to `useRemoveLiquidity.ts`
2. Test remove liquidity flow
3. Verify LP token handling

### Phase 6: Create Composition Hook
1. Create `index.ts` that uses all modules
2. Ensure API matches original hook
3. Replace imports in LiquidityPage
4. Test entire flow works

### Phase 7: Cleanup
1. Archive or delete original `useUniswapV2Liquidity.ts`
2. Update imports across codebase
3. Document new architecture

## Benefits

### Maintainability
- Each module < 400 lines (vs 1,868)
- Clear single responsibility
- Easier to understand and modify

### Testability
- Each module can be tested independently
- Easier to mock dependencies
- Better test coverage

### Developer Experience
- Faster to locate specific logic
- Reduced cognitive load
- Better IDE performance

### Code Quality
- Clearer separation of concerns
- Easier code review
- Less merge conflicts

## Usage Example

```typescript
// After migration, import from index
import { useUniswapV2Liquidity } from './hooks/liquidity'

// Hook API remains the same
const {
  addLiquidity,
  removeLiquidity,
  isLoading,
  error,
  // ... all other exports
} = useUniswapV2Liquidity()
```

## Testing Checklist

After each migration phase:
- [ ] Add liquidity flow works
- [ ] Remove liquidity flow works
- [ ] LP tokens save to localStorage
- [ ] LP tokens load correctly
- [ ] Validation errors display properly
- [ ] Transaction monitoring works
- [ ] Error handling works
- [ ] No TypeScript errors
- [ ] No console errors in browser

## Notes

- Keep original file until migration is complete
- Test each phase thoroughly before proceeding
- Maintain backward compatibility during migration
- Update this README as modules are implemented
