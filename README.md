# DAO Delegates App

This is the frontend whitelabel application that can be used by DAOs to display the delegate stats of their DAOs. The website currently displays the governance stats of all the delegates such as voting power, voting percentage (on-chain and off-chain).

## Setup

There are two ways to setup the Delegate app for your DAO.

### Easy

Contact us at dao@showkarma.xyz and we can host the site for you. You have to simply point your subdomain to our hosted site and it will be up and running right away.

### Difficult

Step 1: Clone the github repo

Step 2: Create a folder inside resources folder

Step 3: Configure a index.ts there just like the other folders do

Step 4: Create an ABI.json and put your contract ABI of your governance token there.

Step 5: Include your config on resources/index.ts

```bash
yarn install && yarn build
```

Step 6: Host the site on your hosting provider
