Visual Studio Code
Repository : https://github.com/sujapoo/TeachPortalWeb.git

Install Node.js (if not already installed):

Go to https://nodejs.org/ and download the latest LTS (Long-Term Support) version of Node.js, which includes npm (Node Package Manager).

You can verify the installation by running the following in your terminal:
node -v
npm -v
These commands should return the version numbers for node and npm.

Navigate to your project folder: Open your terminal and navigate to the folder where your React project is located. You can use the cd command:

cd /path/to/your/project
Install dependencies: Inside the project directory, run the following command to install all the dependencies listed in the package.json file:

npm install
npm install axios react-router-dom jwt-decode
This will download and install all the required libraries for your React app.

Note: If you're using Yarn instead of npm, you can run yarn install instead.

Start the React development server: After the dependencies are installed, you can run the development server to start your app:

npm start
This will start the development server and open the app in your browser. By default, the app will be available at http://localhost:3000/.
