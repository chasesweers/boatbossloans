# Working document (playbook §9). Spec §5 Apply flow, §11 analytics.
Feature: Apply flow
  Every Apply button sends the visitor straight to Vantage's tracked application.

  Scenario: Default Apply link
    Given NEXT_PUBLIC_APPLY_URL is not set
    Then every Apply button points to "https://vantagerecreationalfinance.com/Home/Apply/780"

  Scenario: /apply short link
    Then /apply redirects to the Apply link (a short link for social bios)

  Scenario: Apply link once the tracked URL exists
    Given NEXT_PUBLIC_APPLY_URL is "https://apply.vantage.example/boatboss?id=123"
    Then Apply buttons point to that URL unchanged
    And they open in the same tab with rel="noopener"

  Scenario: UTM parameters, only after Vantage confirms they are safe
    Given NEXT_PUBLIC_APPLY_UTM is "true"
    When I click Apply on /guide/credit-score-for-boat-loan
    Then the URL keeps Vantage's own parameters
    And adds utm_source=boatbossloans, utm_medium=site, utm_campaign=credit-score-for-boat-loan

  Scenario: Every click is measured
    When I click the header Apply button on /about
    Then an "apply_click" event fires with source_page "/about" and button_location "header"

## Unit coverage
- lib/apply: pageSlugFromPath, buildApplyUrl (fallback, passthrough, UTM merge, home slug)
- lib/analytics: track() calls window.plausible when present, no-ops otherwise
## Integration coverage
- ApplyButton: href, rel, no target, fires apply_click with pathname + location
## E2E coverage
- Home hero Apply button href is the Vantage link with no env configured
