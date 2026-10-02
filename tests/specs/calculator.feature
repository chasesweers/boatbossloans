# Working document (playbook §9). Spec §7 Calculator, §10 compliance, §11 calculator_used.
Feature: Boat cost-of-ownership calculator
  Shows what a boat costs to own each year, excluding the loan.

  Scenario: Live results from example defaults
    Given I open /calculator
    Then every input shows a labeled example value I can replace
    And I see total yearly cost, monthly equivalent, cost per hour on the water, and a breakdown chart

  Scenario: Results update as I type
    When I change the purchase price
    Then maintenance (a percent of boat price) and the totals update immediately

  Scenario: Storage type
    When I switch storage from "Marina slip" to "Trailer at home"
    Then the storage amount changes to that type's example value

  Scenario: Purchase price is required
    When I clear the purchase price
    Then results are replaced by a prompt to enter a price

  Scenario: No loan fields, ever (spec §7 hard rule)
    Then there are no loan payment, interest rate, APR, loan term or down payment fields

  Scenario: Analytics
    When I first change an input in a session
    Then "calculator_used" fires once

## Unit coverage
- lib/calculator: yearly total, monthly, per-hour (null at zero hours), fuel, maintenance, breakdown sorted,
  negative/blank inputs treated as zero, price required
## Integration coverage
- BoatCostCalculator: renders defaults + results, live update, storage switch, price-required prompt,
  no loan fields, calculator_used fires once, Apply CTA present
## E2E coverage
- /calculator in the site-wide checks (compliance text scan, axe, noindex, no horizontal scroll)
