# Poncho Pay Coding Test

## About

This project is written in **Node.js**. It is an **Express.js** HTTP server providing RESTful web services.

I spent about 3hrs creating this solution. To be honest I took an existing larger solution that I had coded for a
meditation center and adapted / cut out un-needed features. The original solution had been coded by me only. If I had
more time I would have implemented security but I decided that it would be simpler to remove this feature.

Since there is not much detail about the business logic of checking out I opted to implement the more defined
requirements as a first step.

Swagger documentation is hosted at the root path.

## Development

### Code

1. Install **Node.js**
1. Clone this repo
1. Run `npm install`

### Database

#### Prerequisites

Before running the following scripts you will need to install [`jq`](https://jqlang.github.io/jq) (sorry I tried to use
`node-jq` but had issues with the preinstall script). You will also need to build the project as the scripts reference
compiled Javascript.

Create a MySQL database and run the following:

1. Make sure the `assets/config/dev.json`'s default database URL is pointing to your local database
1. `npm run migrate`
1. `npm run seed:test-data` will create example data for testing

### Build

Run `npm run build`

### Start the API

Run `node dist/lib/api/index.js`

## Implementation Details

### Moment.js

Moments are used exclusively for representing dates. Unless specifically required in a certain time zone, they should be
created in UTC mode (if I was doing this from scratch I would use Luxon now).
