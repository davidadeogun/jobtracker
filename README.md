Job Application Tracker
Description
Job Application Tracker is a web application designed to help job seekers manage their job applications. It allows users to upload their resumes, along with details such as the job title, company name, and company URL. Users can also view a list of all uploaded resumes and download them as needed.

Features
Upload resumes with details like job title, company name, and company URL.
View a list of uploaded resumes.
Download resumes in PDF format.

Installation
Before installing, ensure you have Node.js and MongoDB installed on your system.

Clone the repository:
git clone https://github.com/davidadeogun/jobtracker.git
cd job-application-tracker

Install dependencies:
npm install mongoose multer express 

Create a `.env` file in the root directory and add your MongoDB URI:
MongoDB_URI=mongodb://yourMongoDBUriHere


Usage
To start the application, run:
npm start

Routes
GET /: Home page for uploading resumes.
POST /upload: Endpoint for uploading resumes.
GET /resumes: View a list of all uploaded resumes.
GET /download/:id: Download a specific resume by its ID.


Contributing
Contributions to the Job Application Tracker are welcome. Please ensure to update tests as appropriate.

License
MIT

Contact
For any queries, please contact hello@adeogundavid.com.