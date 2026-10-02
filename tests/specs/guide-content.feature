# Working document (playbook §9). Spec §7 guide pages, §10 compliance.
Feature: Guide content and the compliance gate

  Scenario: Unapproved pages never reach production
    Given a guide page with compliance_approved: false
    When the site is built for production
    Then the page is not generated, not listed on /guide or Home, and not in the sitemap

  Scenario: Drafts are reviewable outside production
    Given a guide page with compliance_approved: false
    When I run the dev server, or a preview deployment with SHOW_DRAFTS=true
    Then the page renders with a visible "Draft" banner

  Scenario: Bad frontmatter fails the build
    Given a guide file whose frontmatter is missing a summary
    Then loading content throws an error naming the file

  Scenario: Lending ad claims are caught before they ship
    Given content containing "as low as 6.99% APR"
    Then the compliance check reports a violation

## Unit coverage
- lib/content: frontmatter validation, slug/filename match, visibility rules, grouping/order, related fill
- lib/compliance: each banned pattern + allowed phrases (disclosure text, general education wording)
- content integrity: every content/guide file parses, related slugs exist, no compliance violations
## E2E coverage
- rendered text of every public page passes the compliance check
