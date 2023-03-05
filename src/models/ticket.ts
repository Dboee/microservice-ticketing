import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// defines the shape or structure of an object that represents a ticket.
interface ITicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Defines the shape of a document that represents a ticket in MongoDB.
interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
  // The document will have some additional properties that are not defined here
  // like _id, __v, and createdAt, inherited from mongoose
}

// Defines a collection of ticket documents in MongoDB.
// And methods that can be called on the collection of users
// Mongoose.Model is a class that represents a collection of documents
// in the database and provides methods for working with them
interface ITicketModel extends mongoose.Model<ITicketDoc> {
  // Build: takes an object that matches the ITicket interface
  // and returns a new document that matches the ITicketDoc interface.
  build(attrs: ITicketAttrs): ITicketDoc;
}

// A schema is a blueprint for creating a model, and a model is an object
// that contains the schema and provides additional functionality to
// interact with the database.

// This is a mongoose model, and has nothing to do with typescript
// Defines the structure and constraints of a document that will be
// stored in a MongoDB database.
// mongoose.Schema defines the structure of a document
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: false,
    },
  },
  {
    // This is a mongoose option that tells it to use the toJSON method
    // when converting the document to JSON to send to the client
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// This is a mongoose plugin that adds a version property to the document
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// This makes sure that the user is created with the correct properties
// and that the properties are of the correct type
// it is a static method, so it is called on the model itself
ticketSchema.statics.build = (attrs: ITicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);

export { Ticket };
