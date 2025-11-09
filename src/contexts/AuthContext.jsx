import { createContext, useContext, useState, useEffect } from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import config from '../config';

const userPool = new CognitoUserPool({
  UserPoolId: config.aws.cognito.userPoolId,
  ClientId: config.aws.cognito.clientId,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error('Error getting session:', err);
          setLoading(false);
          return;
        }
        if (session.isValid()) {
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error('Error getting attributes:', err);
              setLoading(false);
              return;
            }
            const email = attributes.find(attr => attr.Name === 'email')?.Value;
            setUser({
              email: currentUser.getUsername(),
              name: email?.split('@')[0] || currentUser.getUsername(),
              token: session.getIdToken().getJwtToken(),
            });
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          const userData = {
            email,
            name: email.split('@')[0],
            token: session.getIdToken().getJwtToken(),
          };
          setUser(userData);
          resolve(userData);
        },
        onFailure: (err) => {
          console.error('Login error:', err);
          reject(err);
        },
        newPasswordRequired: (userAttributes) => {
          // Handle new password requirement if needed
          reject(new Error('New password required'));
        },
      });
    });
  };

  const signup = async (email, password, name) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
        new CognitoUserAttribute({ Name: 'name', Value: name || email.split('@')[0] }),
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.error('Signup error:', err);
          reject(err);
          return;
        }
        
        // Auto-login after signup
        const userData = {
          email,
          name: name || email.split('@')[0],
          cognitoUser: result.user,
        };
        
        resolve(userData);
      });
    });
  };

  const logout = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
