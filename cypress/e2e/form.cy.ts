/// <reference types="cypress" />

const microsoft = "US5949181045";

beforeEach(() => {
  cy.visit("/");
  cy.clearLocalStorage();
});

describe("Form", () => {
  it("add isin", () => {
    cy.get('[data-test-id="isin-input"]').should("be.visible").type(microsoft);
    cy.get('[data-test-id="add-button"]').click();
    cy.contains("ISINs");
  });
  it("failed validation", () => {
    cy.get('[data-test-id="add-button"]').click();
    cy.contains("ISIN is required");
    cy.get('[data-test-id="isin-input"]')
      .should("be.visible")
      .type("US59491810456");
    cy.get('[data-test-id="add-button"]').click();
    cy.contains("ISIN is too long");
  });
});

export {};
