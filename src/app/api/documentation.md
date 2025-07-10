## API Endpoints

### Authentication

* **`POST /api/auth/register`**: Registers a new user.
    * **Request Body:**
        ```json
        {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "password": "password123"
        }
        ```
    * **Responses:**
        * `201 Created`: User registered successfully.
        * `400 Bad Request`: User already exists.
        * `500 Internal Server Error`: An error occurred.
* **`POST /api/auth/login`**: Logs in a user.
    * **Request Body:**
        ```json
        {
          "email": "john.doe@example.com",
          "password": "password123"
        }
        ```
    * **Responses:**
        * `200 OK`: Successful login.
        * `401 Unauthorized`: Invalid email or password.
* **`GET /api/auth/signout`**: Logs out a user.
* **`GET /api/auth/session`**: Gets the current session.
    * **Responses:**
        * `200 OK`: Returns the session object.
            ```json
            {
              "user": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "image": null,
                "id": "user-id",
                "role": "user",
                "firstName": "John",
                "lastName": "Doe"
              },
              "expires": "2025-08-09T05:03:00.000Z"
            }
            ```

### Allergies

* **`GET /api/allergies`**: Gets a list of all allergies.
    * **Responses:**
        * `200 OK`: Returns an array of allergy objects.
        * `401 Unauthorized`: If the user is not authenticated.
        * `500 Internal Server Error`: An error occurred.
* **`POST /api/allergies`**: Adds a new allergy. (Admin only)
    * **Request Body:**
        ```json
        {
          "name": "Pollen",
          "symptoms": ["Sneezing", "Runny nose", "Itchy eyes"],
          "treatment": "Antihistamines",
          "firstAid": "Avoidance",
          "allergens": ["Grass", "Trees"]
        }
        ```
    * **Responses:**
        * `201 Created`: Allergy added successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/allergies/{id}`**: Retrieves a specific allergy by its ID. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergy object.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

* **`PUT /api/allergies/{id}`**: Updates an existing allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to update.
    * **Request Body:**
        ```json
        {
          "name": "Pollen",
          "symptoms": ["Sneezing", "Runny nose", "Itchy eyes"],
          "treatment": "Antihistamines",
          "firstAid": "Avoidance",
          "allergens": ["Grass", "Trees"]
        }
        ```
    * **Responses:**
        * `200 OK`: Allergy updated successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

* **`DELETE /api/allergies/{id}`**: Deletes an allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to delete.
    * **Responses:**
        * `200 OK`: Allergy deleted successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

## Database

The application uses MongoDB to store user and allergy data. The database schemas are defined in `src/lib/schema.ts` using Zod.

### Collections

The database has two main collections:

* `users`
* `allergies`

### Schemas

#### User Schema

The `UserSchema` defines the structure for user documents in the `users` collection.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the user (optional). |
| `firstName` | string | The user's first name (required). |
| `lastName` | string | The user's last name (required). |
| `role` | enum | The user's role, which can be 'admin' or 'user' (defaults to 'user'). |
| `email` | string | The user's email address (required, must be a valid email). |
| `password` | string | The user's password (required, must be at least 6 characters). |

#### Allergy Schema

The `AllergySchema` defines the structure for allergy documents in the `allergies` collection.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the allergy (optional). |
| `name` | string | The name of the allergy. |
| `symptoms` | array of strings | A list of symptoms associated with the allergy. |
| `treatment` | string | The recommended treatment for the allergy. |
| `firstAid` | string | First aid instructions for the allergy. |
| `allergens` | array of strings | A list of allergens that can trigger the allergy. |

#### PAP Schema (Personal Allergy Profile)

The `PAPSchema` defines the structure for a user's personal allergy profile.

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for the PAP (optional). |
| `userId` | string | The ID of the user this profile belongs to. |
| `gender` | enum | The user's gender ('male', 'female', or 'other'). |
| `doB` | date | The user's date of birth (optional). |
| `allergies` | array of AllergySchema | A list of allergies the user has. |