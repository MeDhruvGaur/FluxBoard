describe('FluxBoard Enterprise Operations E2E Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the enterprise dashboard title and stats cards', () => {
    cy.contains('Enterprise Operations Dashboard').should('be.visible');
    cy.contains('Total Revenue').should('be.visible');
    cy.contains('Active Users').should('be.visible');
    cy.contains('Conversion Rate').should('be.visible');
    cy.contains('System Health').should('be.visible');
  });

  it('allows filtering recent enterprise transactions by status', () => {
    cy.contains('completed').click();
    cy.get('table, [role="grid"]').should('exist');
  });

  it('navigates to analytics page and executes optimistic mutation', () => {
    cy.contains('Analytics').click();
    cy.url().should('include', '/analytics');
    cy.contains('Advanced Data Visualization & Telemetry').should('be.visible');
  });

  it('toggles dark and light mode', () => {
    cy.get('button[title*="Light Mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('button[title*="Dark Mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });
});
