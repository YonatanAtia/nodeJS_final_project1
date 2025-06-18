# Node.js Final Project - Budget Manager

A comprehensive budget management application built as a final project for a Node.js server-side development course. This application helps users manage their ongoing budget with an intuitive interface and robust backend functionality.

## 🎥 Demo

Check out the project demo: [https://youtu.be/zwbGTW-BSrk](https://youtu.be/zwbGTW-BSrk)

## 🚀 Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling library

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (latest stable version)
- MongoDB (latest stable version)
- A code editor (WebStorm recommended)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nodejs-final-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory and add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=3000
   ```
   
   > **Note:** The `.env` file is not included in the repository for security reasons. Make sure to create your own with your MongoDB Atlas credentials.

4. **Import the project to WebStorm**
   - Open WebStorm
   - Select "Open" and choose the project folder
   - WebStorm should automatically detect the Node.js project

## 🚀 Running the Application

1. **Start the server**
   ```bash
   node app.js
   ```
   
   Or if you prefer using npm scripts:
   ```bash
   npm start
   ```

2. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
nodejs-final-project/
├── app.js              # Main application file
├── package.json        # Project dependencies and scripts
├── .env.example        # Environment variables template
├── routes/             # Express routes
├── models/             # Mongoose models
├── views/              # Template files
├── public/             # Static assets
└── README.md           # Project documentation
```

## 🔧 Features

- Budget tracking and management API
- RESTful API endpoints for budget operations
- Database integration with MongoDB
- Server-side application with Express.js

## 🗄️ Database Structure

The application uses **MongoDB Atlas** with the following collections:

### Users Collection
Documents include the following properties:
- `id` - User identifier
- `first_name` - User's first name
- `last_name` - User's last name  
- `birthday` - User's birth date
- `marital_status` - User's marital status

### Costs Collection
Documents include the following properties:
- `description` - Description of the expense
- `category` - Expense category (food, health, housing, sport, education)
- `userid` - ID of the user who made the expense
- `sum` - Amount spent
- `date` - Date and time of expense (auto-generated if not provided)

## 📡 API Endpoints

The application provides RESTful Web Services with the following endpoints:

### 1. Adding Cost Items
**Endpoint:** `POST /api/add`

**Description:** Add a new cost item to the database.

**Parameters:**
- `description` - Description of the expense
- `category` - Must be one of: food, health, housing, sport, education
- `userid` - ID of the user making the expense
- `sum` - Amount of the expense

**Response:** JSON document describing the new cost item that was added.

**Example Request:**
```json
{
  "description": "Coffee and sandwich",
  "category": "food",
  "userid": 123123,
  "sum": 25
}
```

### 2. Getting Monthly Report
**Endpoint:** `GET /api/report`

**Description:** Get all cost items for a specific user in a specific month and year, grouped by categories.

**Query Parameters:**
- `id` - User ID
- `year` - Year (e.g., 2025)
- `month` - Month (1-12)

**Example URL:** `/api/report?id=123123&year=2025&month=11`

**Response Example:**
```json
{
  "userid": 123123,
  "year": 2025,
  "month": 11,
  "costs": [
    {
      "food": [
        {"sum": 12, "description": "choco", "day": 17},
        {"sum": 14, "description": "baigale", "day": 22}
      ]
    },
    {
      "education": [
        {"sum": 82, "description": "math book", "day": 10},
        {"sum": 112, "description": "java book", "day": 12},
        {"sum": 182, "description": "dictionary", "day": 22}
      ]
    },
    {
      "health": []
    },
    {
      "housing": []
    }
  ]
}
```

### 3. Getting User Details
**Endpoint:** `GET /api/users/:userid`

**Description:** Get details of a specific user including their total costs.

**URL Parameter:**
- `userid` - The ID of the user

**Example URL:** `/api/users/123123`

**Response:**
```json
{
  "id": 123123,
  "first_name": "John",
  "last_name": "Doe",
  "total": 450
}
```

### 4. About Information
**Endpoint:** `GET /api/about`

**Description:** Get information about the project creators.

**Response:** JSON document containing the names of the project creators.

**Example Response:**
```json
{
  "first_name": "Yonatan",
  "last_name": "Atia"
}
```

---

**Error Handling:** All endpoints return appropriate JSON error documents when errors occur.

**Supported Categories:** food, health, housing, sport, education

> **Note:** This is a backend API project. Use tools like Postman or curl to test the endpoints, or integrate with a frontend application.

## 📝 Environment Variables

The following environment variables need to be configured:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `PORT` | Port number for the server (default: 3000) | No |

## 🤝 Contributing

This is a final project for educational purposes and is not open for contributions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Yonatan Atia**

---

*This project was created as part of a Node.js server-side development course.*
