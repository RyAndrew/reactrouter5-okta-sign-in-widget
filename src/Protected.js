import React from 'react';

import { useOktaAuth } from '@okta/okta-react';

const Protected = () => {
  
  const { authState } = useOktaAuth();
  let name;
  if(authState.isAuthenticated){
    name = 'Logged In As '+authState.idToken.claims.name;
  }
  
  return <div>
    <h3>Protected</h3><p>{name}</p>
  </div>;
}
export default Protected;
