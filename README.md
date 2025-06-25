# SKJunior2021 - HeadKraken Data Processor

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Setup and Installation](#setup-and-installation)
* [Usage](#usage)
* [License](#license)

## Project Overview

This project is a web application designed to process and visualize data collected from "HeadKraken" devices for the SKJunior2021 competition. It enables users to upload specific data files (key, mxy, mkey), which are then presumably processed to extract keyboard and mouse usage statistics. The application provides a user-friendly interface to upload these files and subsequently view the aggregated statistical results.

## Features

* **File Upload Interface**: Provides dedicated pages for uploading `key`, `mxy`, and `mkey` files from HeadKraken.
* **Keyboard Usage Statistics**: Displays detailed statistics on keyboard key presses, including which keys were pressed and their respective counts.
* **Mouse Usage Statistics**: Presents statistics related to mouse clicks, indicating which mouse buttons were used and their counts.
* **Multilingual Landing Page**: Offers both English and Russian versions of the file upload landing page.
* **Basic Error Handling**: Includes a dedicated error page to inform users of issues.

## Technologies Used

* **Frontend**: HTML, CSS, and JavaScript (for basic client-side interactions).
* **Templating**: EJS (Embedded JavaScript) for dynamically rendering web pages, particularly for displaying statistics based on processed data.
* **Backend**: A server-side app to handle file uploads and data processing.

## Project Structure

```
.
├── public/                     # Static assets
│   └── style/                  # Stylesheets
│       └── style.css
├── views/                      # EJS templates for rendering
│   ├── errorPage.ejs           # Generic error display page
│   ├── landingPage.ejs         # Landing page
│   ├── uploadPage.ejs          # Upload page
│   └── statsPage.ejs           # Page to display keyboard and mouse statistics
```

## Setup and Installation

To set up and run this project locally, you will need a web server environment capable of handling file uploads and rendering EJS templates.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies:**
    Install required packages:
    ```bash
    npm install express ejs multer
    # or
    yarn add express ejs multer
    ```

3.  **Run the Application:**
    Start your server:
    ```bash
    node server.js #
    # or
    npm start
    ```
    The application will then be accessible via your web browser at the configured port.

## Usage

1.  **Access the Landing Page**: Navigate to the application's root URL in your web browser. You will see a prompt to upload files from HeadKraken.
2.  **Upload Files**: Use the file input field to select `key`, `mxy`, and `mkey` files (multiple file selection is supported).
3.  **Submit for Processing**: Click the "Upload" button to send the selected files to the server for processing.
4.  **View Statistics**: After successful processing, you will be redirected to the statistics page, where keyboard and mouse usage data will be displayed in tabular format. If no data is available or processed, a 'Results unavailable' message will appear.
5.  **Navigate Back**: A "Back" button is provided on the statistics and error pages to return to the previous view.

## License

MIT License
