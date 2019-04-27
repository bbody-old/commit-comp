describe('DateRange', () => {
    let clock;
    
    beforeEach(() => {
        const date = new Date(2019, 3, 15)
        clock = cy.clock(date.getTime())
        cy.server()
    })

    it('Checks the header', () => {
        cy.visit('/')
        cy.contains('h1', 'Commit Competition')
        cy.contains('.v-toolbar__title:first-of-type', 'Github User')
        cy.contains('.v-toolbar__title:last-of-type', 'Date Range')
    })

    it('Set date range', () => {
        cy.visit('/')
        cy.url().should('contain', 'end=2019-04-30')
        cy.url().should('contain', 'start=2019-04-01')
    })

    it('Set date range', () => {
        cy.route('https://api.github.com/users/test1', {})
        cy.route('https://github-contributions-api.now.sh/v1/test1?format=nested', 'fixture:contributions.json')
        cy.route('https://api.github.com/users/test2', {})
        cy.route('https://github-contributions-api.now.sh/v1/test2?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')

        cy.get('#user-card input').type('test1{enter}')
        cy.get('#user-card input').type('test2{enter}')

        clock.tick(1000)

        cy.url().should('contain', 'users=test1,test2')
    })
})
