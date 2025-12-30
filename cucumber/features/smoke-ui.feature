@ui
Feature: UI smoke
    Scenario: Home page loads
        Given I open the home page
        Then I should see the conduit home page
