# Psd_shared_bike

## how to run

1.install yarn and node.js
2.run "yarn" in main folder to install all packages we need
3.run "yarn start", wait until you see "To ignore, add...". Browser will open automatically.
If the browser do not open, type "localhost:300" to visit our website
\*Our tests are all on chrome so using other browsers may cause problems.

## Functions

We have three different types of user —— customers, operators and managers
register through website can only get customer account, if you want to get operator and manager account, you need to change the data in database. We'll give you three account to test if you do not want to change it by yourself.

//manager account
usename:test_manager
password:test_manager

//operator account
usename:test_operator
password:test_operator

//customer account
usename:test_customer
password:test_customer

### For users who have not login

When user have not log in, they can only:
1.register: go to register page and register
2.login: go to login page and log in
3.say the position of our stations and bikes(in home page)

### For customers

1.change gender in profile page(you can jump to profile page by click on your username at right top of the home page): just click on the "unset" or "male" or "female" buttons and we will send request to change the data in database
2.charge your account: We do not have real payment function so click on the "charge" button in profile page to charge
3.select bike by bike ID or station ID: search in home page and result will be shown below in the table
4.borrow bikes: in home page, click on the bike icon in the map or the "rent" button in the table to borrow this bike. You can borrow several bike at the same time.
5.return bike: go to order page, click "return" button and return bike. You need to click on the map to tell us where you return the bike. You will pay for the order if you return the bike. If your balance is not enough, it will throw an error.
6.report for repair: click on "report for repair" to report. Same as return, you need to tell the location. And after you report it, the status of bike will be "need repair"

### For operators

can do everything of customer, and operators can also:
1.add bike: click "ass a bike" in bike manage page(at home page click small button at the right top of the screen), then click on the map and fill the detail, click "submit" and then add a bike.
2.edit bike: same as add bike, but you can only edit one bike at same time.
3.track bike: same as edit bike, you can get a map to tell you where the bike is.
4.delete bike: same as add bike, but can delete several bikes at one time.
5.add station: in station manage page
6.edit station: same as add station.
7.see report record and repair bikes: in report page, can only resolve one report at one time and, after report, the bike's status will change from "need repair" to "available". You can also change this in edit bike but we do not suggest you to do so.

### For managers

EXCEPT from things operators can do, managers can see "data analyse" page. Click on the small button at right top of home page to jump to analyse page. You can see many charts which contain data of 7 days.

## extra functions:

### station function:

In order to keep the city clean, we strongly advise you to return and rent bike at stations. We can set many stations around the city and can search bikes in these stations in home page.

### exp and level function:

Each time one user rent a bike and return, user will get 1 exp. More exp you get, higher level you will be. We have 6 levels —— LV0 to LV5. Each level have different discount while pay for order(0% for LV0, 25% for LV5), and we have different sign in profile page.
