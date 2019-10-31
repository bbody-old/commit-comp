describe('Users', () => {
    let clock;
    beforeEach(() => {
        const date = new Date(2019, 3, 15)
        clock = cy.clock(date.getTime())
        cy.server()
    })

    it('Add user with button', () => {
        cy.route('https://api.github.com/users/test', {})
        cy.route('https://github-contributions-api.now.sh/v1/test?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')
        cy.get('#user-card input').type('test')
        cy.get('#user-card button').trigger('click')
        
        cy.contains('[role="list"] a', 'test')
        cy.get('[role="list"] a').should('have.attr', 'href', 'https://github.com/test')

        cy.get('#validUser').should('be.visible')
        cy.contains('#validUser div', 'test was successfully added')

        cy.contains('table tbody tr:first-of-type td:nth-of-type(1)', 'test')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(2)', '1')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(3)', '1 day')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(4)', '0.07/day')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(5)', '7.14%')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(6)', '1 day')

        clock.tick(2000);

        cy.get('#validUser').should('have.attr', 'style', 'display: none;')
    })

    it('Add user with enter', () => {
        cy.route('https://api.github.com/users/test', {})
        cy.route('https://github-contributions-api.now.sh/v1/test?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')
        cy.get('#user-card input').type('test{enter}')
        
        cy.contains('[role="list"] a', 'test')
        cy.get('[role="list"] a').should('have.attr', 'href', 'https://github.com/test')

        cy.get('#validUser').should('be.visible')
        cy.contains('#validUser div', 'test was successfully added')

        cy.contains('table tbody tr:first-of-type td:nth-of-type(1)', 'test')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(2)', '1')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(3)', '1 day')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(4)', '0.07/day')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(5)', '7.14%')
        cy.contains('table tbody tr:first-of-type td:nth-of-type(6)', '1 day')

        clock.tick(2000);

        cy.get('#validUser').should('have.attr', 'style', 'display: none;')
    })

    it('Ignore duplicate users', () => {
        cy.route('https://api.github.com/users/test', {})
        cy.route('https://github-contributions-api.now.sh/v1/test?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')
        cy.get('#user-card input').type('test{enter}')

        cy.get('#user-card input').type('test{enter}')
        
        cy.get('#usernameDuplicate').should('be.visible')
        cy.contains('#usernameDuplicate div', 'test already exists in the list')

        clock.tick(2000);

        cy.get('#usernameDuplicate').should('have.attr', 'style', 'display: none;')
    })

    it('Errors on invalid user', () => {
        cy.route({
            method: 'GET',
            url: 'https://api.github.com/users/test',
            status: 404,
            response: {},
        })
        cy.route('https://github-contributions-api.now.sh/v1/test?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')
        cy.get('#user-card input').type('test{enter}')
        
        cy.get('#invalidUser').should('be.visible')
        cy.contains('#invalidUser div', 'test is not a valid Github user')
    })

    it('Errors on Github API', () => {
        cy.route({
            method: 'GET',
            url: 'https://api.github.com/users/test',
            status: 500,
            response: {},
        })
        cy.route('https://github-contributions-api.now.sh/v1/test?format=nested', 'fixture:contributions.json')
        
        cy.visit('/')
        cy.get('#user-card input').type('test{enter}')
        
        cy.get('#apiError').should('be.visible')
        cy.contains('#apiError div', 'API does not appear to be working, please try again later')
    })

    it('Errors on Contributions API', () => {
        cy.route('https://api.github.com/users/test', {})
        cy.route({
            method: 'GET',
            url: 'https://github-contributions-api.now.sh/v1/test?format=nested',
            status: 400,
            response: {},
        })
        
        cy.visit('/')
        cy.get('#user-card input').type('test{enter}')
        
        cy.get('#apiError').should('be.visible')
        cy.contains('#apiError div', 'API does not appear to be working, please try again later')

        cy.contains('[role="list"] a', 'test')
        cy.get('[role="list"] a').should('have.attr', 'href', 'https://github.com/test')
    })
  })
  