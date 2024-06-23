import {namesOfBtnShadowWeb} from "./shared/dataPage"
import selector from "./shared/selectorsPage" 

describe('User Profile Tests', () => {
    beforeEach(() => {
        cy.visit('https://www.htmlelements.com/demos/menu/shadow-dom/index.htm');
    })

    const clickShadowBtn = (btnName) => {
        cy.get(selector.parentShadowDomComponent).shadow().contains(namesOfBtnShadowWeb[btnName])
        .click()
        .invoke("prop", "outerText").then(text => {
            cy.log(text)
        });
    }
    it('Verify all buttons exist', () => {
        namesOfBtnShadowWeb.forEach(btnName => {
            cy.get(selector.parentShadowDomComponent).shadow()
            .contains(btnName).should('exist')
        })
    })
    it('Verify All Button Text', () => {
        namesOfBtnShadowWeb.forEach(btnName => {
            cy.get(selector.parentShadowDomComponent).shadow().contains(btnName).should('have.text', btnName)
        })
    })
   
    it('Verify Click in All Buttons', () => {
        for (let i=0; i < namesOfBtnShadowWeb.length; i++){
            clickShadowBtn(i);
        }
    })
 
    it('Verify Menu Items Under Each Button', () => {
        // Assuming each button shows a menu
        const menuItemSelectors = ['#menuItemsGroup1', '#menuItemsGroup2', '#menuItemsGroup3', '#menuItemsGroup4'];
        namesOfBtnShadowWeb.forEach((btnName, index) => {
            cy.get('.smart-ui-component').shadow().contains(btnName).click();
            cy.get('.smart-ui-component').shadow().find(menuItemSelectors[index]).should('exist');
        });
    });
  
})