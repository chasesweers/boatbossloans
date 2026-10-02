# Working document (playbook §9). Spec §7 Newsletter, §11 analytics.
Feature: Newsletter signup
  The provider (Kit) stores subscribers. We never do.

  Scenario: Successful signup
    Given I am on a page with the signup strip
    When I enter "skipper@example.com" and submit
    Then I see "Check your inbox to confirm" (double opt-in)
    And a "newsletter_signup" event fires with my source_page

  Scenario: Invalid email
    When I submit "not-an-email"
    Then I see "Enter a valid email address" and nothing is sent

  Scenario: Bot fills the honeypot
    When the hidden "company" field is filled
    Then the server responds OK but never calls the provider

  Scenario: Too many attempts
    Given one IP has submitted 5 times in 10 minutes
    When it submits again
    Then the server responds 429

  Scenario: Provider is down
    When the provider call fails
    Then I see a friendly error and can try again

## Unit coverage
- lib/newsletter/schema: email required, first name optional/trimmed, honeypot field
- lib/rateLimit: allows N per window, blocks N+1, resets after window, separate keys
- app/api/newsletter/route: 400 invalid, 200 honeypot (no provider call), 429 limit, 502 provider failure, 200 success
## Integration coverage
- NewsletterForm: validation message, success state, server error, analytics event
## E2E coverage
- /newsletter: submit → confirmation message (console provider in CI)
