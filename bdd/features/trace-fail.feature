@tracefail @ui
Feature: Trace viewer demo

    Scenario: Intentional failure generates trace
        Given I am on the home page
        Then I should see a non-existent heading
