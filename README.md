# vZDC Website
---
The Virtual Washington ARTCC Website.

>[!WARNING]  
> This repo and readme are still under development!

---

Environment Variables (all are required):
- `DEV_MODE`: If set to `true`, disables the VATUSA roster check and grants access to all pages regardless of rating.
- `DATABASE_URL`: URL for the database. Example: `postgres://postgres:password@localhost:5432/website-db`
- `NEXTAUTH_URL`: URL to specify where VATSIM should redirect users after a successful login.  This should just be the url without anything after `.com` `.org` etc.  Example: `https://vzdc.org`
- `NEXTAUTH_SECRET`: Secret key to encrypt tokens, this can be anything (hopefully secure).  Example: `anything`
- `VATSIM_CLIENT_ID`: Client ID for VATSIM Connect.
- `VATSIM_CLIENT_SECRET`: Client Secret for VATSIM Connect.
- `VATUSA_FACILITY`: Name of the facility. Example: `ZDC`
- `VATUSA_API_KEY`: Used to authenticate with the VATUSA API.

# Development

### Docker Compose (Development)

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#docker-compose-development)

Build the docker image (if you change the tag name, make sure to update it in the `docker-compose/docker-compose.yaml` file):

```shell
docker build -t website .
```

Navigate to the `docker-compose` directory and create a `.env.local` file. Configure the environment variables for the website docker image based on `.env.example`.

Warning

Do not modify the `DATABASE_URL` and the `NEXTAUTH_URL` variables!

Important

Make sure the redirect URI for VATSIM OAuth2 is set to `http://localhost/api/auth/callback/vatsim` unless you changed the port in the environment variables.

Run the `docker-compose.yaml` file:

```shell
docker-compose up
```

Make sure to seed the database by accessing `http://localhost/api/seed`.

Important

You need to do this everytime a new docker-compose instance is created since all data is wiped on shutdown.

### Development Setup

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#development-setup)

#### Prerequisites

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#prerequisites)

- Node v18 or later
- NPM 9.6 or later
- **EMPTY** Relational Database (preferably Postgres)
- VATSIM Connect Keys (Development or Production) (redirect url should be `{NEXTAUTH_URL}/api/auth/callback/vatsim` replace `NEXTAUTH_URL` with the actual url in the environment variables)

#### Steps

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#steps)

Clone this repository:

```shell
git clone https://github.com/vZDC-ARTCC/website.git
```

Change directories:

```shell
cd website
```

Install dependencies:

```shell
npm i
```

In the root of the project, create a file called `.env.local` and configure your environment variables.

Migrate the database:

```shell
npm run db:deploy
```

Generate the Prisma Client:

```shell
npx prisma generate
```

#### Development Server

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#development-server)

Run the development server:

```shell
npm run dev
```

Navigate to [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

Navigate to [http://localhost:3000](http://localhost:3000/) and enjoy!


# Production

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#production)

Build the project:

```shell
npm run build
```

Start the production server:

Important

Make sure environment variables on the server are configured correctly

```shell
npm run start
```

Seed the database (`/api/seed`) on your production URL.

##### Docker

[](https://github.com/vZDC-ARTCC/ids/edit/master/README.md#docker)

After configuring facilities correctly, run the `docker build` command:

```shell
docker build -t website .
```

Run the image with the environment variables:

```shell
docker run -p 80:80 --env-file <YOUR .env.local FILE> website
```

Important

The container will run on port 80, unlike the development server.

---
## To-Do List / Features



---
### Developed by the vZDC ARTCC Web Team.
##### README Version 0.1.0
