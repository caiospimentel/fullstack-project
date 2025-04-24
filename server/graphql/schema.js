const { buildSchema } = require('graphql');
const Event = require('../models/Event');

const schema = buildSchema(`
  type Event {
    id: ID!
    title: String!
    description: String
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  input EventInput {
    title: String!
    description: String
    date: String!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
  }

  type Mutation {
    createEvent(input: EventInput!): Event
    deleteEvent(id: ID!): Event
  }
`);

const root = {
  events: async () => {
    return await Event.find().sort({ date: -1 });
  },

  event: async ({ id }) => {
    return await Event.findById(id);
  },

  createEvent: async ({ input }) => {
    const newEvent = new Event(input);
    return await newEvent.save();
  },

  deleteEvent: async ({ id }) => {
    return await Event.findByIdAndDelete(id);
  },
};

module.exports = {
  schema,
  root,
};
