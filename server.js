
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const app = express()
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: "This respresents a book written by an author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { type: AuthorType,
        resolve: (book) => {
            return authors.find(author => author.id === book.authorId )
        }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: "This respresents an author of a book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
    })
})


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description:'List of All Books',
            resolve: () => books //would be a database
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description:'List of All Authors',
            resolve: () => authors //would be a database
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

const authors = [
    { id: 1, name: 'J.K. Rowling '},
    { id: 2, name: 'J.R.R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
]

const books = [
    { id: 1, name: 'Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Prison of Azkaban', authorId: 1 },
    { id: 3, name: 'Goblet of Fire', authorId: 1 },
    { id: 4, name: 'Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(5000, () => console.log('Listening on port 5000'
))