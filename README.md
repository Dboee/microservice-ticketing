# microservice-ticketing


| Route                  | Method | Body                              | Purpose                        |
| ---------------------- | ------ | --------------------------------- | ------------------------------ |
| /api/tickets      | GET   | - | Retrieve all tickets         |
| /api/tickets/:id      | GET   | - | Retrieve ticket with specific ID |
| /api/tickets     | POST   | {title: string, price: string}                                | Create a ticket                       |
| /api/tickets | PUT    | {title: string, price: string}                                 | Update a ticket     |

### To create a docker build use

docker build -t username/auth .
