// / <reference types="cypress" />
import selector from "./shared/selectorsPage"
import { todoItemCat, todoItemDog, filterTexts, listOfItems} from "./shared/dataPage"

describe("Tests todos", () =>{
  
    beforeEach(() => {
        cy.visitTodosURL();
    })

    const addTodoItems = (items) => {
        items.forEach(item => {
            cy.get(selector.inputTodoItem).type(`${item}{enter}`);
        })
    } 

    const toggleTodoItem = (index) => {
        cy.get(selector.lengthTodoList).eq(index).find('.toggle').click()
    };

    const deleteTodoItem = (index) => {
        cy.get(selector.lengthTodoList).eq(index).find('.destroy').click({force:true});
    }

    const verifyTodoListLength = (index) => {
        cy.get(selector.lengthTodoList).should(`have.length`, index)
    }
    
    const verifyTodoCount = (count) => {
        const itemText = count === 1 ? 'item' : 'items';
        cy.get(selector.numberOfTodoItems).should("have.text", `${count} ${itemText} left`);
    }

    it("Initial Verification", () => {
        cy.get("h1").should("contain", "todos");
        cy.get(selector.inputTodoItem).should('have.attr', 'placeholder', 'What needs to be done?');
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`);
        verifyTodoCount(1);
        cy.get(`.filters a`).each((filter, index) => {
            cy.wrap(filter).should('have.text', filterTexts[index]);
        });

    })
    it(" Add a New Todo Item", () => {
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`)
        cy.get(selector.lengthTodoList).should("have.length", 1).and("contain", todoItemCat)
    })
    it("Edit an Existing Todo Item", () => {
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`)
        cy.get(selector.lengthTodoList).dblclick();
        cy.get(`.edit`).clear().type(`${todoItemDog}{enter}`)
        cy.get(selector.lengthTodoList).should("have.length", 1).and("contain", todoItemDog)

    })
    it("Mark a Todo Item as Completed", () => {
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`)
        toggleTodoItem(0);
        cy.get(selector.lengthTodoList).should(`have.class`, `completed`)
        verifyTodoCount(0);
    })
    it("Delete a Todo Item", () => {
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`);
        deleteTodoItem(0);
        verifyTodoListLength(0);
        verifyTodoCount(0);
    })
    it("Filter Todo Items(Active)", () => {
        addTodoItems(listOfItems);
        cy.get(selector.lengthTodoList).should('have.length', listOfItems.length);
        toggleTodoItem(1);
        toggleTodoItem(2);
        cy.contains('Active').click()
        verifyTodoListLength(listOfItems.length-2)
        cy.get(selector.lengthTodoList).should('not.have.class', 'completed');
    })
    it("Filter Todo Items (Completed)", () => {
        addTodoItems(listOfItems);
        cy.get(selector.lengthTodoList).should('have.length', listOfItems.length);
        cy.get(selector.lengthTodoList).eq(2).find('.toggle').click();
        cy.contains('Completed').click();
        verifyTodoListLength(1);
        cy.get(selector.lengthTodoList).should('have.class', 'completed');
    })
    it("Clear Completed Todo Items", () => {
        addTodoItems(listOfItems);
        cy.get(selector.lengthTodoList).should('have.length', listOfItems.length);
        toggleTodoItem(0);
        toggleTodoItem(2)
        deleteTodoItem(2);
        deleteTodoItem(0);
        verifyTodoListLength(listOfItems.length-2);
        cy.get(selector.lengthTodoList).should('not.have.class', 'completed');
    })
    it("Clear Completed Todo Items with btn Clear Completed", () => {
        addTodoItems(listOfItems);
        cy.get(selector.lengthTodoList).should('have.length', listOfItems.length);
        toggleTodoItem(0);
        toggleTodoItem(2);
        cy.contains('Clear completed').click()
        verifyTodoListLength(listOfItems.length-2)
        cy.get(selector.lengthTodoList).should('not.have.class', 'completed');
    })
    it("Data Persistence Across Page Reloads", () => {
        addTodoItems(listOfItems);
        cy.get(selector.lengthTodoList).should('have.length', listOfItems.length);
        cy.reload();
        verifyTodoListLength(0);
        verifyTodoCount(0);

    })
    it("Check Dynamic Changes Numbers of Items", () => {
        const newListOfItems = Array.from(listOfItems);
        addTodoItems(newListOfItems);
        verifyTodoCount(newListOfItems.length);
        toggleTodoItem(0);
        newListOfItems.shift();
        verifyTodoCount(newListOfItems.length);
        cy.get(selector.inputTodoItem).type(`${todoItemCat}{enter}`);
        newListOfItems.push(todoItemCat)
        verifyTodoCount(newListOfItems.length);
    })
})
