import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import copy from 'fast-copy';

interface input {
  ingredient_id: string
  stock_used: number
}

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  selectedLang = 'en';
  userData = {
    fullName: '',
    img: '',
    balance: 0
  }
  constructor(private apollo: Apollo) { }

  login(username: any, password: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        getToken(
          email: "${username}"
          password:"${password}"
          ) 
          {
          message
          user{
            email
            role
            fullName
            }
          }
      }`
    })
  }
  getOneUser() {
    return this.apollo.watchQuery({
      query: gql`query Query {
        getOneUser {
          img
          fullName
          balance
          first_name
          last_name
          email
        }
      }`
    })
  }

  addIngredient(name: any, stock: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation 
      Mutation{
        addIngredient(
          name: "${name}" 
          stock: ${stock}
        ) {
          name
          stock
        }
      }`
    })
  }

  createRecipe(data: any): Observable<any> {
    let a: input[] = data.input
    return this.apollo.mutate({
      mutation: gql`mutation 
      CreateRecipe( $a: [ingredientInput]){
          createRecipe(
            recipe_name: "${data.recipe_name}"
            description: "${data.description}"
            img: "${data.img}"
            price: ${data.price}
            input: $a
            ) {
            recipe_name
          }
      }`, variables: {
        a
      }
    })
  }

  createTransaction(id: string, amount: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation{
        createTransaction(input: {
          recipe_id: "${id}"
          amount: ${amount}
          note:""
        }) {
          user_id {
            first_name
          }
        }
      }`
    })
  }

  updateRecipe(data: any, id: string): Observable<any> {
    let a: input[] = data.input
    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateRecipe( $a: [ingredientInput]){
          updateRecipe(
            id: "${id}"
            recipe_name: "${data.recipe_name}"
            description: "${data.description}"
            img: "${data.img}"
            price: ${data.price}
            input: $a
            ) {
            recipe_name
          }
      }`, variables: {
        a
      }
    })
  }

  updateRecipeStatus(data: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateRecipe{
          updateRecipe(
            id: "${data.id}"
            status: ${data.status}
            ) {
            recipe_name
          }
      }`
    })
  }
  updateRecipeHighlight(data: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateRecipe{
          updateRecipe(
            id: "${data.id}"
            highlight: ${data.highlight}
            ) {
            recipe_name
          }
      }`
    })
  }

  updateTransaction(id: string, action: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateTransaction{
          updateTransaction(
            id: "${id}"
            option: ${action}
            ) {
            id
          }
      }`
    })
  }

  editAmountTransaction(id: string, amount: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateTransaction{
          updateTransaction(
            id: "${id}"
            amount: ${amount}
            ) {
            id
          }
      }`
    })
  }

  updateTransactionNote(id: string, note: string): Observable<any> {
    console.log(note);

    return this.apollo.mutate({
      mutation: gql`mutation 
      UpdateTransaction{
          updateTransaction(
            id: "${id}"
            note: "${note}"
            ) {
            id
          }
      }`
    })
  }


  updateIngredient(id: any, name?: any, stock?: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation {
        updateIngredient(
          id: "${id}", 
          name: "${name}", 
          stock: ${stock}
          ) {
          name
          stock
        }
      }`
    })
  }

  getActiveMenu(name?: string, highlight?: boolean | null, sortPrice?: string | null) {
    let a: any = ""
    let b = null;
    if (name) {
      a = name;
    }
    if (highlight) {
      b = highlight
    }
    return this.apollo.watchQuery({
      query: gql`query GetActiveMenu {
        getActiveMenu(
          recipe_name: "${a}",
          highlight: ${b},
          sorting:{
            price: ${sortPrice}
          }
        ) {
          data {
            id
            highlight
            available
            recipe_name
            description
            ingredients {
              ingredient_id {
                name
              }
            }
            price
            img
          }
        }
      }`
    })
  }

  getAllTransactions(status: string, isCart: boolean, fullName?: string, page?: number,
    date_start?: string, date_end?: string, filter_date?: string | null) {
    if (fullName == null) {
      fullName = ""
    }
    if (page == null) {
      page = 1
    }
    if (date_start == null) {
      date_start = ""
    }
    if (date_end == null) {
      date_end = ""
    }
    if (filter_date == null) {
      filter_date = null
    }

    console.log(filter_date);

    return this.apollo.watchQuery({
      query: gql`query GetAllTransactions {
      getAllTransactions(
        order_status: "${status}",
        page: ${page},
        limit:10,
        isCart: ${isCart},
        fullName_user: "${fullName}",
        order_date_start: "${date_start}",
        order_date_end: "${date_end}",
        filterDate: {
          option: ${filter_date}
        } 
        ) {
          max_page
          data {
          id
          totalPrice
          available
            menu {
              recipe_id {
              recipe_name
              img
              id
              status
            }
            amount
            note
          }
          order_date
                user_id {
            fullName
          }
        }
      }
    }`
    })
  }

  getAllRecipes() {
    return this.apollo.watchQuery({
      query: gql`query GetAllRecipes {
        getAllRecipes {
          data {
            id
            available
            recipe_name
            description
            ingredients {
              ingredient_id {
                name
                id
              }
            }
            price
            img
          }
        }
      }`
    })
  }

  getAllRecipesPagination(page: number, val: string, sortPrice?: string | null) {
    let a: any = ""
    if (val) {
      a = val;
    }
    return this.apollo.watchQuery({
      query: gql`query GetAllRecipes {
        getAllRecipes(
          page: ${page}, 
          limit: 10, 
          recipe_name: "${a}",
          sorting: {
            price: ${sortPrice}
          }
          ) {
          data {
            id
            highlight
            available
            recipe_name
            description
            ingredients {
              ingredient_id {
                name
                id
              }
              stock_used
            }
            price
            img
            status
          }
          max_page
        }
      }`
    })
  }

  deleteIngredient(id: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation
      {
        deleteIngredient(
          id:"${id}"
          ) 
        {
          message
        }
      }`
    })
  }


  getAllIngredients() {
    return this.apollo.watchQuery({
      query: gql`query {
        getAllIngredient(
          sort: {
            name: asc,
          }
        ) {
          data {
            id
            name 
            status
            stock
          }
        }
      }`
    })
  }

  getAllIngredientsPagination(page?: number, name?: string, sortName?: string, sortStock?: string) {
    let a: any = ""
    if (name) {
      a = name;
    }
    return this.apollo.watchQuery({
      query: gql`query {
        getAllIngredient(
          page: ${page}, 
          limit: 10, 
          name: "${a}",
          sort: {
            name: ${sortName},
            stock: ${sortStock}, 
          }
          ){
          data {
            id
            name 
            status
            stock
          }
          max_page
        }
      }`
    })
  }

  checkout(): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation {
        checkoutTransaction {
          id
        }
      }`
    })
  }

  logout(): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation logout{
        logout(isUsed: false, email: "${localStorage.getItem('email')}") {
        isUsed
        }
      }`
    })
  }


  extractIngredients(data: Array<any>) {
    let ingredients: Array<string> = []
    for (let a of data) {
      let x = ''
      for (let b of a.ingredients) {
        if (x == '') {
          x = b.ingredient_id.name;
        }
        else {
          x = x + ', ' + b.ingredient_id.name;
        }
      }
      ingredients.push(x)
    }
    return ingredients
  }

  extractIngredientsTable(data: any) {
    data = copy(data)
    let i = 0
    // let ingredients: Array<string> = []
    for (let a of data) {
      let x = ''
      for (let b of a.ingredients) {
        if (x == '') {
          x = b.ingredient_id.name;
        }
        else {
          x = x + ', ' + b.ingredient_id.name;
        }
      }
      // ingredients.push(x)
      data[i].extractedIngredient = x
      i++
    }
    return data
  }

  getAllUsers() {
    return this.apollo.watchQuery({
      query: gql`query Query {
        getAllUsers {
          data {
            fullName
          }
        }
      }`
    })
  }

  updateUser(data: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation{
        updateUser(
          last_name: "${data.lastName}", 
          first_name:"${data.frontName}", 
          email: "${data.email}", 
          img: "${data.avatarURL}") {
          id
        }
      }`
    })
  }

  changePassword(data: any, action: boolean) {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation{
        changePassword(
          email:"${data.email}", 
          fromLogin: ${action}, 
          old_password: "${data.password}", 
          new_password: "${data.newPassword1}") {
          id
        }
      }`
    })
  }

  register(data: any) {
    return this.apollo.mutate({
      mutation: gql`mutation Register{
        register(
          password: "${data.password}", 
          email: "${data.email}", 
          last_name: "${data.lastName}", 
          first_name: "${data.frontName}", 
          security_question: "${data.question}", 
          security_answer: "${data.answer}"
          ) {
          email
      
        }
      }`
    })
  }

  forgotPassword(data: any) {
    console.log(data.newPassword);

    return this.apollo.mutate({
      mutation: gql`mutation Mutation {
        forgotPassword(
          email: "${data.email}",
          token: "${data.token}",
          new_password: "${data.newPassword}"
        ) {
          security_question
        }
      }
      `
    })
  }

  reqTokenByEmail(data: any) {
    return this.apollo.mutate({
      mutation: gql`mutation Mutation {
        reqTokenByEmail(email: "${data.email}") {
          id
        }
      }
      `
    })
  }

  getAllSpecialOffers() {
    return this.apollo.watchQuery({
      query: gql`query Query {
        getAllSpecialOffers {
          data {
            title
            description
            menuDiscount {
              recipe_id {
                recipe_name
                price
                discountAmount
                finalPrice
                img
              }
            }
          }
        }
      }`
    })
  }

}
