
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
        books: { type: new GraphQLList(BookType),
        resolve: () => {
            return books.filter(book => book.id === author.id)
        }
        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent,args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description:'List of All Books',
            resolve: () => books //would be a database
        },
        author: {
            type: AuthorType,
            description: "This is an Author of a Book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description:'List of All Authors',
            resolve: () => authors //would be a database
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent,args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent,args) => {
                const author = { id: authors.length + 1, name: args.name }
               authors.push(author)
                return author
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
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