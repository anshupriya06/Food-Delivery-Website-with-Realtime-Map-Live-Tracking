import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemByCity'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'

export const serverUrl = import.meta.env.VITE_SERVERURL || "http://localhost:8000"

function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  
  const { userData, isLoading } = useSelector((state) => state.user);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/signup" element={!userData ? <SignUp/> : <Navigate to="/"/>}/>
      <Route path="/signin" element={!userData ? <SignIn/> : <Navigate to="/"/>}/>
      <Route path="/forgot-password" element={!userData ? <ForgotPassword/> : <Navigate to="/"/>}/>
      <Route path="/" element={userData ? <Home/> : <Navigate to="/signin"/>}/>
      <Route path="/create-edit-shop" element={userData ? <CreateEditShop/> : <Navigate to="/signin"/>}/>
      <Route path="/add-item" element={userData ? <AddItem/> : <Navigate to="/signin"/>}/>
      <Route path="/edit-item/:itemId" element={userData ? <EditItem/> : <Navigate to="/signin"/>}/>
      <Route path="/cart" element={userData ? <CartPage/> : <Navigate to="/signin"/>}/>
      <Route path="/checkout" element={userData ? <CheckOut/> : <Navigate to="/signin"/>}/>
    </Routes>
  )
}

export default App
