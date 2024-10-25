# cypress-visual-regression
Visual regression tests in cypress

After cloning the repo, run 

`npm install`

Add following folders into cypress folder

screenshots,

screeshots/base,

screenshots/diff


Commands for running tests

taking base screenshots: run in terminal`npx cypress run --env environment=prod --browser chrome` or `npm run base`

comparing the screenshots: `npx cypress run --env environment=dev --browser chrome` or `npm run compare`

delete diff, compare and spec folder contents `npx run cleanup`

If you want to run in headed mode instead of `npx cypress run` use `npx cypress open`
