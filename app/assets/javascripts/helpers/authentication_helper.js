// var register = function(route) {
//     console.log();
//     return $.ajax({
//       url: App.urls.register,
//       type: "POST",
//       data: {
//         "user[name]": route.controllerFor('newUser').name,
//         "user[email]": controllers.newUser.email,
//         "user[password]": controllers.newUser.password,
//         "user[password_confirmation]": controllers.newUser.password_confirmation
//       },
//       success: function(data) {
//         return route.controllerFor('currentUser').set('content', data.user);
//         console.log('current user is now ' + route.controllerFor('currentUser').get('content'));
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//         return route.controllerFor('registration').set("errorMsg", "That email/password combo didn't work.  Please try again.");
//       }
//     });
//   };

// var logout = function(transition) {
//       log.info("Logging out...");
//       return $.ajax({
//         url: App.urls.logout,
//         type: "DELETE",
//         dataType: "json",
//         success: function(data, textStatus, jqXHR) {
//           $('meta[name="csrf-token"]').attr('content', data['csrf-token']);
//           $('meta[name="csrf-param"]').attr('content', data['csrf-param']);
//           log.info("Logged out on server");
//           route.controllerFor('currentUser').set('content', null);
//           return route.transitionTo('index');
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//           return alert("Error logging out: " + errorThrown);
//         }
//       });
//     };

// var login = function(route) {
//         console.log(route.currentModel);
//         return $.ajax({
//           url: App.urls.login,
//           type: "POST",
//           data: {
//             "user[email]": route.currentModel.email,
//             "user[password]": route.currentModel.password
//           },
//           success: function(data) {
//             log.log("Login Msg " + data.user.dummy_msg);
//             route.controllerFor('currentUser').set('content', data.user);
//             return route.transitionTo('index');
//           },
//           error: function(jqXHR, textStatus, errorThrown) {
//             if (jqXHR.status === 401) {
//               return route.controllerFor('login').set("errorMsg", "That email/password combo didn't work.  Please try again");
//             } else if (jqXHR.status === 406) {
//               return route.controllerFor('login').set("errorMsg", "Request not acceptable (406):  make sure Devise responds to JSON.");
//             } else {
//               return p("Login Error: " + jqXHR.status + " | " + errorThrown);
//             }
//           }
//         });
//       };