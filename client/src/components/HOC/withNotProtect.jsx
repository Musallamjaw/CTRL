/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function NotProtectdRoute({ element }) {
  const authData = useSelector((state) => state.authData);

  const accessToken = authData.accessToken;

  return !accessToken ? element : <Navigate to='/' />
}