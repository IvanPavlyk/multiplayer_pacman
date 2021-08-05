import React from 'react';
import { Container } from 'react-bootstrap';

import './account-stats.scss';

const AccountStats = () => {
  return(
    <Container>
      <table className='table table-striped account-table'>
        <thead>
          <th scope='col'>YOUR MATCH HISTORY</th>
          <th scope='col'></th>
          <th scope='col'></th>
        </thead>

        <thead className='stats-header'>
          <th scope='col'>Result</th>
          <th scope='col'>Score</th>
          <th scope='col'>Date</th>
        </thead>

        <tbody>
          <tr>
            <th scope='row'>Win</th>
            <td>413,424</td>
            <td>8/5/21</td>
          </tr>
          <tr>
            <th scope='row'>Lose</th>
            <td>10,050</td>
            <td>8/5/21</td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
};

export default AccountStats;