# fetch cities

http://localhost:9990/location

# fetch all restaurants

http://localhost:9990/restaurant

# fetch restaurant wrt city

http://localhost:9990/restaurant?stateId=2

# fetch meals of all restaurants

"http://localhost:9990/mealtypes"


<!-- 2nd page -->

# fetch the restaurant list on the bases of  mealtypes .... result of quicksearch
http://localhost:9990/restaurant?mealId=3 

# fetch the restaurant on the base jof cuisisnes as query and meal as params
http://localhost:9990/filter/4?cuisineId=2

# cost filter wrt mealid only
http://localhost:9990/filter/1?lprice=400&hprice=600

# cost filter wrt cuisine and costs.. this will be th tp bcs exact func
http://localhost:9990/filter/2?cuisineId=3&lprice=400&hprice=500






