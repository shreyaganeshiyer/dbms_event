# Install dependencies

npm install

# run both react and node.js

npm run dev

node server/index.js

# in .env file

the details to be added is the database that querylens itself uses not the "users" database details

means we are tracking all the db connections a user has made in our own OG "querylens_app" db

for secret run this : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
