const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Event = require('../../models/Event');

const testQuery = (query) => {
  return request(app)
    .post('/graphql')
    .send({ query })
    .set('Content-Type', 'application/json');
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(resolve, 100)); // <- ensures monitor thread exits

});

beforeEach(async () => {
  await Event.deleteMany({});
});

describe('GraphQL: Event', () => {
  it('should create an event', async () => {
    const mutation = `
      mutation {
        createEvent(input: {
          title: "Test Event",
          description: "Created from test",
          date: "2025-05-01T10:00:00.000Z"
        }) {
          id
          title
          description
          date
        }
      }
    `;

    const res = await testQuery(mutation);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.createEvent.title).toBe('Test Event');
  });

  it('should return a list of events', async () => {
    await Event.create({
      title: 'Seeded Event',
      description: 'Via Mongoose',
      date: new Date('2025-05-02T10:00:00.000Z')
    });

    const query = `
      query {
        events {
          id
          title
          description
          date
        }
      }
    `;

    const res = await testQuery(query);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.events.length).toBeGreaterThan(0);
    expect(res.body.data.events[0].title).toBe('Seeded Event');
  });

  it('should fetch a single event by ID', async () => {
    const created = await Event.create({
      title: 'Fetch Test',
      description: 'Single fetch test',
      date: new Date('2025-06-01T12:00:00.000Z')
    });
  
    const query = `
      query {
        event(id: "${created._id}") {
          id
          title
          description
          date
        }
      }
    `;
  
    const res = await testQuery(query);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.event).toBeTruthy();
    expect(res.body.data.event.title).toBe('Fetch Test');
  });

  it('should delete an event by ID', async () => {
    const toDelete = await Event.create({
      title: 'Delete Me',
      description: 'To be deleted',
      date: new Date('2025-07-01T12:00:00.000Z')
    });
  
    const mutation = `
      mutation {
        deleteEvent(id: "${toDelete._id}") {
          id
          title
        }
      }
    `;
  
    const res = await testQuery(mutation);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.deleteEvent.title).toBe('Delete Me');
  
    const found = await Event.findById(toDelete._id);
    expect(found).toBeNull(); 
  });
  
});
