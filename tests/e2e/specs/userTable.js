describe('Users', () => {
    let clock;
    beforeEach(() => {
        const date = new Date(2019, 3, 15)
        clock = cy.clock(date.getTime())
        cy.server()
    })

    it('handles no data', () => {
        cy.visit('/')
        cy.contains('table tbody tr td', 'No data available')
    });
    
    it('handles sorting', () => {
        cy.route('https://api.github.com/users/test1', {})
        cy.route('https://api.github.com/users/test2', {})
        cy.route('https://github-contributions-api.now.sh/v1/test1?format=nested', 'fixture:contributions.json')
        cy.route('https://github-contributions-api.now.sh/v1/test2?format=nested', 'fixture:contributions1.json')
        
        cy.visit('/#/?users=test1,test2&start=2019-01-01&end=2019-01-31')

        cy.tick(2000)

        // Sort by commits
        cy.get('.commits').trigger('click')

        cy.contains('table tbody tr:nth-of-type(1) td:nth-of-type(1)', 'test2')
        cy.contains('table tbody tr:nth-of-type(2) td:nth-of-type(1)', 'test1')

        // Sort by streak
        cy.get('.streak').trigger('click')
        cy.get('.streak').trigger('click')

        cy.contains('table tbody tr:nth-of-type(1) td:nth-of-type(1)', 'test1')
        cy.contains('table tbody tr:nth-of-type(2) td:nth-of-type(1)', 'test2')

        // Sort by daysWithCommits
        cy.get('.daysWithCommits').trigger('click')
        cy.get('.daysWithCommits').trigger('click')

        cy.contains('table tbody tr:nth-of-type(1) td:nth-of-type(1)', 'test1')
        cy.contains('table tbody tr:nth-of-type(2) td:nth-of-type(1)', 'test2')

        // Sort by commitsPerDay
        cy.get('.commitsPerDay').trigger('click')
        cy.get('.commitsPerDay').trigger('click')

        cy.contains('table tbody tr:nth-of-type(1) td:nth-of-type(1)', 'test2')
        cy.contains('table tbody tr:nth-of-type(2) td:nth-of-type(1)', 'test1')

        // Sort by percentageOfDays
        cy.get('.percentageOfDays').trigger('click')
        cy.get('.percentageOfDays').trigger('click')

        cy.contains('table tbody tr:nth-of-type(1) td:nth-of-type(1)', 'test1')
        cy.contains('table tbody tr:nth-of-type(2) td:nth-of-type(1)', 'test2')
    })
})