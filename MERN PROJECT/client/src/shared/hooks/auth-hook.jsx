import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () =>{
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
  
    const login = useCallback((uid, token, expirationData) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate =
      expirationData || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expriation: tokenExpirationDate.toISOString(),
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem("userData");
    }, []);
  
    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remainingTime =
          tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);
    
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expriation > new Date())
      ) {
        login(storedData.userId, storedData.token, new Date(storedData.expriation));
      }
    }, [login]);
  return { token, login, logout, userId };
}