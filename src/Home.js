import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { oktaSignInConfig } from './config';

const Home = () => {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) return null;

  const login = async () => history.push('/login');

  const logout = async () => oktaAuth.signOut();

  let button, name, loginDemoUserCreds;
  console.log(authState);
  if(authState.isAuthenticated){
    name = 'Logged In As '+authState.idToken.claims.name;
    button = <button onClick={logout}>Logout</button>;
    loginDemoUserCreds = '';
  }else{
    name = '';
    button =  <button onClick={login}>Login</button>;
    loginDemoUserCreds = (<div>Login with:
      Okta User:<br/>
        test@test.com<br/>
        <br/>
      Azure AD IDP Federated User:<br/>
      fred@aad.supersecure.xyz<br/>
        <br/>
        Password:<br/>
        Secret123$</div>);

    //after you login via an idp you must do this step
    //since we redirect back to the home page after login - this works but user experience is poor
    //check if we have an okta session, if so, get a token and reload
    oktaAuth.session.exists().then(function (sessionExists) {
        if (sessionExists) {
            oktaAuth.token.getWithoutPrompt(oktaSignInConfig).then(function (response) {
                oktaAuth.tokenManager.setTokens(response.tokens);
                window.location.reload();
            });
        }
    });

  }

  const redStyle = {
    color: 'red'
  };

  return (
    <div>
      <p>{name}</p>
      <p>{button}</p>
      <Link to='/'>Home</Link><br/>
      <Link to='/protected'>Protected</Link> (Requires Login)<br/>
      <p style={redStyle}>
        This example relies on 3rd party cookies which will be deprecated in 2023!<br/>
        Incognito Mode will not work for IDP login!<br/>
        Read more here: <a href='https://support.okta.com/help/s/article/FAQ-How-Blocking-Third-Party-Cookies-Can-Potentially-Impact-Your-Okta-Environment?language=en_US'>https://support.okta.com/help/s/article/FAQ-How-Blocking-Third-Party-Cookies-Can-Potentially-Impact-Your-Okta-Environment?language=en_US</a><br/>
        Documentation on this approach: <a href='https://github.com/okta/okta-signin-widget#idp-discovery'>https://github.com/okta/okta-signin-widget#idp-discovery</a><br/>
        <br/>
        <b>What is a better alternative?</b><br/>
        Using webfinger and redirects: <a href='https://reactrouter5-okta-auth-js.glitch.me/'>https://reactrouter5-okta-auth-js.glitch.me/</a>
      </p>
      <br/>
      {loginDemoUserCreds}<br/>
      <br/>
      <a target="_top" href="https://glitch.com/edit/#!/remix/reactrouter5-okta-siw-idp-3rd-party-cookie">
        <img
          src="https://cdn.glitch.com/605e2a51-d45f-4d87-a285-9410ad350515%2FLogo_Color.svg?v=1618199565140"
          alt=""
        />
        Remix This App on Glitch
      </a>
    </div>
  );
};
export default Home;
