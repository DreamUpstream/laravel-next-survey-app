# Survey Application

This repository contains a survey application where users can submit feedback and administrators can create and view survey results. The application is divided into two main parts:

- Backend: Laravel application with MySQL, running in Docker using Laravel Sail.
- Frontend: Next.js application for the user interface.

## Table of Contents

- [Survey Application](#survey-application)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Usage](#usage)
    - [Creating Surveys](#creating-surveys)
    - [Submitting Surveys](#submitting-surveys)
    - [Viewing Survey Results](#viewing-survey-results)
      - [Possible improvements:](#possible-improvements)

## Setup

### Backend Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/DreamUpstream/laravel-next-survey-app.git
   cd backend_survey_app
   ```

2. **Install dependencies**:

   ```sh
   composer install
   ```

3. **Copy the example environment file**:

   ```sh
   cp .env.example .env
   ```

4. **Update environment variables**:

   - Open the `.env` file and set the necessary configuration (if default is not ok)

5. **Generate application key**:

   ```sh
   php artisan key:generate
   ```

6. **Run Docker containers using Laravel Sail**:

   ```sh
   ./vendor/bin/sail up -d
   ```

7. **Run migrations**:
   ```sh
   ./vendor/bin/sail artisan migrate
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```sh
   cd frontend_survey_app
   ```

2. **Install dependencies**:

   ```sh
   yarn install
   ```

3. **Copy the example environment file**:

   ```sh
   cp .env.example .env
   ```

4. **Update environment variables**:

   - Open the `.env.local` file and make sure that the `NEXT_PUBLIC_BACKEND_URL` to `http://localhost` + your port.

5. **Run the development server**:
   ```sh
   npm run dev
   ```

## Usage

### Creating Surveys

1. **Navigate to the dashboard**:

   - Access the user view at `http://localhost:3000/`.
   - Click register, and register
   - Then you will be logged into `http://localhost:3000/dashboard`

2. **Create a new survey**:
   - Fill in the survey title and add questions (text or rating).
   - Click "Create Survey" to save the survey.

### Submitting Surveys

1. **Navigate to the home page**:

   - Access the survey submission page at `http://localhost:3000`.

2. **Fill in the survey**:
   - Answer the survey questions.
   - Click "Submit" to save the responses.

### Viewing Survey Results

1. **Navigate to the dashboard**:

   - Access the admin dashboard at `http://localhost:3000/dashboard`.

2. **View survey results**:
   - The average rating responses will be displayed in a bar chart.
   - Text responses will be displayed below the chart.

#### Possible improvements:

In backend, maybe the queries in Controller can be moved to seperate service, and there even repositories can be made in order to have repository and or service pattern

Request validation could be done in rules() method corresponding to the request in a seperate class

in frontend, design can be impoved a lot (spacing etc.)...
