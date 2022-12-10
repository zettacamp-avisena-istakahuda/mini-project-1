import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const uri = environment.apiURL;  
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
   let token: any = 'j'
   token = localStorage.getItem('token');
   if (token==null){
    token = 'x'
   }
  return {
    link: httpLink.create({
      uri, headers: new HttpHeaders().set('Authorization', token )
    }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
  constructor() {}
 }
