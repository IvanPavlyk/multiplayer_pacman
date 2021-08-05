import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';

import './account.scss';


const Account = () => {
  const [profile, setProfile] = useState({});

  useEffect( () => {
    const id = sessionStorage.getItem('id');
    axios.get(`http://localhost:3002/account/${id}`)
      .then( res => {
        setProfile(res.data[0]);
      });
  }, []);

  return(
    <Container>
      <table className='table table-striped account-table'>
        <thead>
          <th scope='col'>PROFILE</th>
          <th scope='col'></th>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>USERNAME</th>
            <td>{profile.username}</td>
          </tr>
          <tr>
            <th scope='row'>EMAIL</th>
            <td>{profile.email}</td>
          </tr>
        </tbody>
      </table>
    </Container>);

};

export default Account;