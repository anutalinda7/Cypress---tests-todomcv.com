describe('User Profile Tests', () => {
    it('Should Display User Information Correctly', () => {
        cy.visit('http://127.0.0.1:5500/cypress/e2e/shared/userJohn.html')
        // Load the fixture file
        cy.fixture('user.json').then((user) => {
            
            cy.get('#name').invoke('val').should('equal', user.name)
            cy.get('#name').should('have.value', user.name);
            cy.get('#age').should('have.value', user.age);
            cy.get('#email').should('have.value', user.email);
            cy.get('#address').within(() => {
                cy.get('#street').should('have.value', user.address.street);
                cy.get('#city').should('have.value', user.address.city);
                cy.get('#state').should('have.value', user.address.state);
                cy.get('#postalCode').should('have.value', user.address.postalCode);
            })
            cy.get('#phoneNumbers').within(() => {
                cy.get('.phone').eq(0).should('contain', user.phoneNumbers[0].number);
                cy.get('.phone').eq(1).should('contain', user.phoneNumbers[1].number)
            })
        });
      });
    });