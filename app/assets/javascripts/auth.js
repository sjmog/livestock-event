
  App.Auth = Em.Auth.extend({
    signInEndPoint: '/users/sign_in',
    signOutEndPoint: '/users/sign_out',
    tokenKey: 'auth_token',
    tokenIdKey: 'user_id',
    modules: ['emberData', 'authRedirectable', 'actionRedirectable', 'rememberable'],
    authRedirectable: {
      route: 'sign-in'
    },
    actionRedirectable: {
      signInRoute: 'admin',
      signInSmart: true,
      signInBlacklist: ['sign-in'],
      signOutRoute: 'index'
    },
    rememberable: {
      tokenKey: 'remember_token',
      period: 7,
      autoRecall: true
    }
  });

