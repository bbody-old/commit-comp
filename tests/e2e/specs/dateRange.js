describe('DateRange', () => {
    let clock;
    
    beforeEach(() => {
        const date = new Date(2019, 3, 15)
        clock = cy.clock(date.getTime())
        cy.server()
    })

    it('Checks the dates are there', () => {
        cy.visit('/')
        cy.get('.v-date-range__input-field input').should('have.value', '2019-04-01    To     2019-04-30')
        cy.contains('#startDate .v-list__tile__title', '2019-04-01')
        cy.contains('#endDate .v-list__tile__title', '2019-04-30')
    })

    it('Checks the dates are there from url', () => {
        cy.visit('/#/?start=2018-12-04&end=2018-12-15')
        cy.get('.v-date-range__input-field input').should('have.value', '2018-12-04    To     2018-12-15')
        cy.contains('#startDate .v-list__tile__title', '2018-12-04')
        cy.contains('#endDate .v-list__tile__title', '2018-12-15')
    })

    it('Checks the dates after opening and pressing cancel', () => {
        cy.visit('/')

        cy.get('.v-date-range__input-field input').click({force: true})

        clock.tick(2000)

        cy.get('.v-date-range__menu-content .v-card__actions button:first-of-type').click()

        clock.tick(2000)

        cy.get('.v-date-range__input-field input').should('have.value', '2019-04-01    To     2019-04-30')
        cy.contains('#startDate .v-list__tile__title', '2019-04-01')
        cy.contains('#endDate .v-list__tile__title', '2019-04-30')
    })

    it('Checks the dates after opening and changing dates', () => {
        cy.visit('/')

        cy.get('.v-date-range__input-field input').click({force: true})

        clock.tick(2000)

        cy.get('.v-date-range__picker--start table tbody tr:first-of-type td:nth-of-type(5) button').click()

        cy.get('.v-date-range__picker--end table tbody tr:last-of-type td:nth-of-type(1) button').click()

        cy.get('.v-date-range__menu-content .v-card__actions button:last-of-type').click()

        clock.tick(2000)

        cy.get('.v-date-range__input-field input').should('have.value', '2019-04-04    To     2019-04-28')
        cy.contains('#startDate .v-list__tile__title', '2019-04-04')
        cy.contains('#endDate .v-list__tile__title', '2019-04-28')
    })
})
