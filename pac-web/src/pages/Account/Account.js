import React from 'react';
import Container from 'react-bootstrap/Container';

import './account.scss';

const Account = () => {
  return(
    <Container>
      <table className='table table-striped account-table'>
        <thead className='thead-dark'>
          <th scope='col'>PROFILE</th>
          <th scope='col'></th>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>USERNAME</th>
            <td>TheLegend42</td>
          </tr>
          <tr>
            <th scope='row'>NAME</th>
            <td>Mark John</td>
          </tr>
          <tr>
            <th scope='row'>EMAIL</th>
            <td>email@email.com</td>
          </tr>
        </tbody>
      </table>
    </Container>);

};

export default Account;