# cypress-visual-regression
Visual regression tests in cypress

After cloning the repo, run 

`npm install`

Add following folders into cypress folder

screenshots,

screeshots/base,

screenshots/diff


Commands for running tests

taking base screenshots change the .env to have value `CYPRESS_CAP=true` and run in terminal`npx cypress run --env environment=prod --browser chrome`

comparing the screenshots  change the .env to have value `CYPRESS_CAP=false` the `npx cypress run --env environment=dev --browser chrome`

If you want to run in headed mode instead of `npx cypress run` use `npx cypress open`
