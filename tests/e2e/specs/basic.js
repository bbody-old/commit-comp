// https://docs.cypress.io/api/introduction/api.html

describe('Meta information', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Commit Competition')
    // cy.contains('title', 'Commit Competition')
    cy.contains('.v-toolbar__title', 's')
  })
})
