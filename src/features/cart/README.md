# cart

        Feature role in `SmartMarket Lite Web Client`:
        part of `auth → catalog → product details → cart → checkout → orders → admin products`.

        Expected UI units:
        - CartPage
- CartItemRow
- QuantityStepper
- CartSummary
- EmptyCartState

        Implementation rules:
        - keep API calls in `src/api` or feature hooks;
        - define loading, empty and error states;
        - add tests for success and failure paths;
        - keep components typed and reusable where possible.
