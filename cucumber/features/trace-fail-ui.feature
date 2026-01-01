@ui @tracefail
Feature: Trace viewer demo (Cucumber)
    Scenario: Intentional UI failure generates trace
        Given I open the home page
        Then I should see a heading that does not exist
