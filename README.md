# cypress-visual-regression
Visual regression tests in cypress

After cloning the repo, run 

`npm install`

Add following folders into cypress folder

screenshots,

screeshots/base,

screenshots/diff


Commands for running tests

taking base screenshots `CYPRESS_CAP=true npx cypress run --env environment=prod`

compare the `CYPRESS_CAP=false npx cypress run --env environment=dev`
