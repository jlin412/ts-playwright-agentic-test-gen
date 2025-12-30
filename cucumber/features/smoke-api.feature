@api
Feature: API smoke
    Scenario: GET /api/tags returns tags array
        Given the API is ready
        When I request tags
        Then I should receive a tags array
