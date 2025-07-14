## API Endpoints

### Authentication

- **`POST /api/auth/register`**: Registers a new user.
  - **Request Body:**

        ```json
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "password123"
        }
        ```

  - **Responses:**
    - `201 Created`: User registered successfully.
    - `400 Bad Request`: User already exists.
    - `500 Internal Server Error`: An error occurred.
- **`POST /api/auth/login`**: Logs in a user. (Handled by NextAuth)
  - **Request Body:**

        ```json
        {
            "email": "john.doe@example.com",
            "password": "password123"
        }
        ```

  - **Responses:**
    - `200 OK`: Successful login.
    - `401 Unauthorized`: Invalid email or password.
- **`GET /api/auth/signout`**: Logs out a user. (Handled by NextAuth)
- **`GET /api/auth/session`**: Gets the current session.
  - **Responses:**
    - `200 OK`: Returns the session object.

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

### Allergens

* **`GET /api/allergens`**: Gets a list of all allergens.
    * **Responses:**
        * `200 OK`: Returns an array of allergen objects.
        * `401 Unauthorized`: If the user is not authenticated.
        * `500 Internal Server Error`: An error occurred.
* **`POST /api/allergens`**: Adds a new allergen. (Admin only)
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
        * `201 Created`: Allergen added successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/allergens/{id}`**: Retrieves a specific allergen by its ID. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergen to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergen object.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergen with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

* **`PUT /api/allergens/{id}`**: Updates an existing allergen. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergen to update.
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
        * `200 OK`: Allergen updated successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergen with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

* **`DELETE /api/allergens/{id}`**: Deletes an allergen. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergen to delete.
    * **Responses:**
        * `200 OK`: Allergen deleted successfully.
        * `401 Unauthorized`: If the user is not an admin.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergen with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

### Personal Allergy Profile (PAP)

- **`GET /api/pap`**: Retrieves the Personal Allergy Profile for the authenticated user.
  - **Responses:**
    - `200 OK`: Returns the user's PAP object.
    - `401 Unauthorized`: If the user is not authenticated.
    - `404 Not Found`: If the user's PAP is not found.
    - `500 Internal Server Error`: An error occurred.

- **`PUT /api/pap`**: Updates the Personal Allergy Profile for the authenticated user.
  - **Request Body (example):**

        ```json
        {
          "gender": "male",
          "doB": "1990-01-01T00:00:00.000Z",
          "allergens": [
            {
              "name": "Peanuts",
              "symptoms": ["Hives", "Swelling"],
              "treatment": "Epinephrine",
              "firstAid": "Administer EpiPen",
              "allergens": ["Peanuts"]
            }
          ]
        }
        ```
  - **Responses:**
    - `200 OK`: PAP updated successfully.
    - `401 Unauthorized`: If the user is not authenticated.
    - `404 Not Found`: If the user's PAP is not found.
    - `500 Internal Server Error`: An error occurred.

### Users

- **`PUT /api/user/{id}`**: Updates an existing user. (Admin or owner only)
  - **Parameters:**
    - `id` (string, required): The ID of the user to update.
  - **Request Body:**

        ```json
        {
            "firstName": "John",
            "lastName": "Doe"
            <!-- "email": "john.doe@example.com", -->
            <!-- "password": "newpassword123" -->
        }
        ```

  - **Responses:**
    - `200 OK`: User updated successfully.
    - `401 Unauthorized`: If the user is not authenticated.
    - `403 Forbidden`: If the user is not an admin and is not the owner of the profile.
    - `400 Bad Request`: If the provided ID is invalid.
    - `404 Not Found`: If the user with the specified ID is not found.
    - `500 Internal Server Error`: An error occurred.


### Allergies

* **`GET /api/allergies`**: Gets a list of all allergies.
    * **Responses:**
        * `200 OK`: Returns an array of allergy objects.
        * `500 Internal Server Error`: An error occurred.
* **`POST /api/allergies`**: Adds a new allergy. (Admin only)
    * **Request Body:**
        ```json
        {
          "name": "Cat Allergy",
          "allergensId": ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
        }
        ```
    * **Responses:**
        * `201 Created`: Allergy added successfully.
        * `400 Bad Request`: If validation fails.
        * `401 Unauthorized`: If the user is not an admin.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/allergies/{id}`**: Retrieves a specific allergy by its ID.
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergy object.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.
* **`PUT /api/allergies/{id}`**: Updates an existing allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to update.
    * **Request Body:**
        ```json
        {
          "name": "Feline Allergy",
          "allergensId": ["507f1f77bcf86cd799439011"]
        }
        ```
    * **Responses:**
        * `200 OK`: Allergy updated successfully.
        * `400 Bad Request`: If validation fails or the ID is invalid.
        * `401 Unauthorized`: If the user is not an admin.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.
* **`DELETE /api/allergies/{id}`**: Deletes an allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to delete.
    * **Responses:**
        * `200 OK`: Allergy deleted successfully.
        * `400 Bad Request`: If the provided ID is invalid.
        * `401 Unauthorized`: If the user is not an admin.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

### Cross allergens 

* **`GET /api/cross`**: Gets a list of all cross allergens of the current user.
    * **Responses:**
        * `200 OK`: Returns an array of allergy objects.
        * `401 Unauthorized`: If the user is not authenticated.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/cross/{id}`**: Retrieves a specific cross allergens of an allergen by its ID.
    * **Parameters:**
        * `id` (string, required): The ID of the allergen to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergen object in an array.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.


### Allergies

* **`GET /api/allergies`**: Gets a list of all allergies.
    * **Responses:**
        * `200 OK`: Returns an array of allergy objects.
        * `500 Internal Server Error`: An error occurred.
* **`POST /api/allergies`**: Adds a new allergy. (Admin only)
    * **Request Body:**
        ```json
        {
          "name": "Cat Allergy",
          "allergensId": ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
        }
        ```
    * **Responses:**
        * `201 Created`: Allergy added successfully.
        * `400 Bad Request`: If validation fails.
        * `401 Unauthorized`: If the user is not an admin.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/allergies/{id}`**: Retrieves a specific allergy by its ID.
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergy object.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.
* **`PUT /api/allergies/{id}`**: Updates an existing allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to update.
    * **Request Body:**
        ```json
        {
          "name": "Feline Allergy",
          "allergensId": ["507f1f77bcf86cd799439011"]
        }
        ```
    * **Responses:**
        * `200 OK`: Allergy updated successfully.
        * `400 Bad Request`: If validation fails or the ID is invalid.
        * `401 Unauthorized`: If the user is not an admin.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.
* **`DELETE /api/allergies/{id}`**: Deletes an allergy. (Admin only)
    * **Parameters:**
        * `id` (string, required): The ID of the allergy to delete.
    * **Responses:**
        * `200 OK`: Allergy deleted successfully.
        * `400 Bad Request`: If the provided ID is invalid.
        * `401 Unauthorized`: If the user is not an admin.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

### Cross allergens 

* **`GET /api/cross`**: Gets a list of all cross allergens of the current user.
    * **Responses:**
        * `200 OK`: Returns an array of allergy objects.
        * `401 Unauthorized`: If the user is not authenticated.
        * `500 Internal Server Error`: An error occurred.
* **`GET /api/cross/{id}`**: Retrieves a specific cross allergens of an allergen by its ID.
    * **Parameters:**
        * `id` (string, required): The ID of the allergen to retrieve.
    * **Responses:**
        * `200 OK`: Returns the allergen object in an array.
        * `400 Bad Request`: If the provided ID is invalid.
        * `404 Not Found`: If the allergy with the specified ID is not found.
        * `500 Internal Server Error`: An error occurred.

## Database

The application uses MongoDB to store user and allergy data. The database schemas are defined in `src/lib/schema.ts` using Zod.

### Collections

The database has three main collections:

* `users`
* `allergens`
* `paps`

### Schemas

#### User Schema

The `UserSchema` defines the structure for user documents in the `users` collection.

| Field       | Type     | Description                                                           |
| :---------- | :------- | :-------------------------------------------------------------------- |
| `_id`       | ObjectId | Unique identifier for the user (optional).                            |
| `firstName` | string   | The user's first name (required).                                     |
| `lastName`  | string   | The user's last name (required).                                      |
| `role`      | enum     | The user's role, which can be 'admin' or 'user' (defaults to 'user'). |
| `email`     | string   | The user's email address (required, must be a valid email).           |
| `password`  | string   | The user's password (required, must be at least 6 characters).        |

#### Allergen Schema

The `AllergenSchema` defines the structure for allergy documents in the `allergens` collection.

| Field      | Type             | Description                                          |
| :--------- | :--------------- | :--------------------------------------------------- |
| `_id`      | ObjectId         | Unique identifier for the allergy (optional).        |
| `name`     | string           | The name of the allergy.                             |
| `symptoms` | array of strings | A list of symptoms associated with the allergy.      |
| `treatment`| string           | The recommended treatment for the allergy.           |
| `firstAid` | string           | First aid instructions for the allergy.              |

#### Allergy Schema

The `AllergySchema` defines the structure for allergy documents in the `allergies` collection.

| Field      | Type             | Description                                          |
| :--------- | :--------------- | :--------------------------------------------------- |
| `_id`      | ObjectId         | Unique identifier for the allergy (optional).        |
| `name`     | string           | The name of the allergy.                             |
| `allergensId` | array of ObjectId | A list of allergen IDs associated with the allergy. |

#### PAP Schema (Personal Allergy Profile)

The `PAPSchema` defines the structure for a user's personal allergy profile in the `paps` collection.

| Field     | Type                | Description                                                          |
| :-------- | :------------------ | :------------------------------------------------------------------- |
| `_id`     | ObjectId            | Unique identifier for the PAP (optional).                            |
| `userId`  | ObjectId            | The ID of the user this profile belongs to.                          |
| `gender`  | enum                | The user's gender ('male', 'female', or 'other'), nullable.          |
| `doB`     | date                | The user's date of birth (optional, nullable).                       |
| `allergens`| array of AllergenSchema | A list of allergens the user has (defaults to an empty array).     |