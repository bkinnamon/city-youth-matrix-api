# City Youth Matrix API

This is the API backend for the City Youth Matrix web app.

## API Reference

Authentication is performed through JSON Web Tokens (JWT). When you register or login a token is generated and returned. This token should be sent in the `Authorization` header in the form `Bearer <token>`.

### User Management

- `/register` [POST]: Creates a new user with the provided username and password. Returns the user object and a token.
- `/login` [POST]: Authenticate a user with the provided username and password. Returns the user object and a token.
- `/users` [GET]: Gets the list of all users. Currently only available to `dispatcher` type users. This should be used for a user administration view.
- `/users/:id` [GET]: Gets information for the user with the provided ID. Currently available if the provided ID matches the current logged in user or if the user type is `dispatcher`. This should be used for a user configuration view.
- `/users/:id` [PUT]: Updates a user. Currently available if the provided ID matches the current logged in user or if the user type is `dispatcher`. This should be used to save data from a user configuration view.
- `/users/:id` [DELETE]: Deletes a user. Currently available if the provided ID matches the current logged in user or if the user type is `dispatcher`.

### Event Management

- `/events` [POST]: Creates a new event. The required keys are `name`, `partner`, `start`, `end`, and  `description`. The `start` and `end` should be stored as Unix timestamps.
- `/events` [GET]: Gets the list of all events.
- `/events/:id` [GET]: Gets the specified event.
- `/events/:id` [PUT]: Updates the specified event. Only a user with type `dispatcher` is allowed to perform this request.
- `/events/:id` [PATCH]: Updates the registration list to be the provided registrations list. Limited to `driver` type users.
- `/events/:id` [PATCH]: Adds a registration to the list. This can be done by a user with type `dispatcher` or `driver`.
- `/events/:id` [DELETE]: Deletes an event. Only a user with type `dispatcher` is allowed to delete an event.
