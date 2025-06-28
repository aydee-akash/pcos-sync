import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Load user data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  async function signup(email, password, userData) {
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.email === email)) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = {
        uid: Date.now().toString(),
        email,
        ...userData,
        createdAt: new Date().toISOString(),
        geneSequences: [],
        phenotypeHistory: [],
        symptoms: []
      };

      // Save user to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Set as current user
      setCurrentUser({ uid: newUser.uid, email });
      setUserProfile(newUser);
      localStorage.setItem('currentUser', JSON.stringify({ uid: newUser.uid, email }));
      localStorage.setItem('userProfile', JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, you would verify the password hash here
      // For now, we'll just check if the password matches
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      setCurrentUser({ uid: user.uid, email: user.email });
      setUserProfile(user);
      localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid, email: user.email }));
      localStorage.setItem('userProfile', JSON.stringify(user));

      return user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
  }

  async function updateProfile(uid, data) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.uid === uid);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      users[userIndex] = { ...users[userIndex], ...data };
      localStorage.setItem('users', JSON.stringify(users));

      // Update current profile if it's the logged-in user
      if (currentUser?.uid === uid) {
        setUserProfile(users[userIndex]);
        localStorage.setItem('userProfile', JSON.stringify(users[userIndex]));
      }
    } catch (error) {
      throw error;
    }
  }

  async function addGeneSequence(uid, sequenceData) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.uid === uid);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const newSequence = {
        ...sequenceData,
        addedAt: new Date().toISOString()
      };

      users[userIndex].geneSequences = [...(users[userIndex].geneSequences || []), newSequence];
      localStorage.setItem('users', JSON.stringify(users));

      if (currentUser?.uid === uid) {
        setUserProfile(users[userIndex]);
        localStorage.setItem('userProfile', JSON.stringify(users[userIndex]));
      }
    } catch (error) {
      throw error;
    }
  }

  async function addPhenotypeHistory(uid, phenotypeData) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.uid === uid);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const newPhenotype = {
        ...phenotypeData,
        recordedAt: new Date().toISOString()
      };

      users[userIndex].phenotypeHistory = [...(users[userIndex].phenotypeHistory || []), newPhenotype];
      localStorage.setItem('users', JSON.stringify(users));

      if (currentUser?.uid === uid) {
        setUserProfile(users[userIndex]);
        localStorage.setItem('userProfile', JSON.stringify(users[userIndex]));
      }
    } catch (error) {
      throw error;
    }
  }

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    updateProfile,
    addGeneSequence,
    addPhenotypeHistory,
    geneSequences: userProfile?.geneSequences || []
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 