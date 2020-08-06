# Restaurant-Review-App-Backend

This repository contains the back-end code for a "Restaurant Review Application" The application is built using MongoDB, Express and Node.

This Rest API based Node server supports user authentication (via login/registration system) before accessing any of the available endpoints.

# Available Endpoints

•POST /users/login (requires "username" and "password" in the body of the POST request)


•POST /users/signup (requires "firstname", "lastname", "username" and "password" in the body of the POST request)


•GET /dishes (returns list of all the dishes available in the restaurant)


•POST /dishes (allows the admin to add more dishes to the menu)


•DELETE /dishes (allows the admin to delete all the dishes in the menu)


•GET /dishes/:dishId (returns the details of a dish with a specific dishId)


•PUT /dishes/:dishId (allows the admin to update a specific dish in the menu)


•DELETE /dishes/:dishId (allows the admin to delete a specific dish from the menu)


•GET /favourites (returns all the dishes added to favourite by the respective user)


•POST /favourites (allows user to add multiple dishes to favourites list by including the dishId in the body of the request)


•DELETE /favourites (allows the user to delete all the dishes from their favourites list)


•GET /favourites/:dishId (returns the details of a specific dish if user has added that dish to thier favourites list)


•POST /favourites/:dishId (allows the user to add any specific dish to thier favourites list)


•DELETE /favourites/:dishId (allows the user to delete a specific dish from their favourites list)


•GET /comments (returns all the comments for a specific dish - the dishId should be passed as a query param.)


•POST /comments (allows the user to post a comment for a specific dish - requires "rating" , "comment" and "dish(dishId)" to be passed in body of the request)


•DELETE /comments (allows the admin to delete all the comments from the dishes menu)


•GET /comments/commentId (allows the users to view a specific comment on the dish)


•PUT /comments/commentId (allows the user to update thier comment on the dish that they post earlier)


•DELETE /comments/commentId ( allows the user to delete a specific comment that they post earlier)


•POST /uploadImage (allows the admin to upload images onto the server which can later be added to dishes description collection)


# Routes for admin use only

•GET /leaders (returns the list of all members of the restaurant)


•POST /leaders (allows admins to add more members to the org)


•DELETE /leaders (allows the admins to delete all the members of the org)


•GET/PUT/DELETE on /leaders/:leaderId


•GET /promotions (returns the list of all the promotions initiated for the restaurant)


•POST /promotions (allows admins to create more promotion ads)


•DELETE /promotions (allows the admins to delete all the ongoing promotions)


•GET/PUT/DELETE on /promotions/:promoId

