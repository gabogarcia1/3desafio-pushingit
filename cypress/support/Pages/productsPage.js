export class ProductsPage {
    constructor() {
        this.url = "home/onlineshop"
        this.addProduct = 'button[data-cy="add-product"]'
        this.filterSelect = '#search-type'
        this.searchBar = '#search-bar'
        this.productName='#name'
        this.productPrice='#price'
        this.deleteProductModelButton='button[id="saveEdit"]'
        this.closeModal='#closeModal'

    }
    checkUrl() {
        cy.url().should('include', this.url)
    }
    clickOnAddProduct(){
        cy.get(this.addProduct).click()

    }
    selectFilterById(){
        cy.get(this.filterSelect).select('id')
    }

    filterProductById(id){
        cy.get(this.searchBar).type(id).type('{enter}')
    }
    deleteSearchBar(){
        cy.get(this.searchBar).clear( {force: true})
    }

    deleteProdById(id){
        const trashButtonById = `#delete-${id}`
        cy.get(trashButtonById).click()
        cy.get(this.deleteProductModelButton).click()
    }
    addToCartById(id){
        const addToCartByID=`#add-to-cart-${id}`
        cy.get(addToCartByID).click()
        cy.get(this.closeModal).click()
    }
    goToShoppingCart(){
        cy.get('#goShoppingCart').click()
        cy.wait(5000)
    }

}