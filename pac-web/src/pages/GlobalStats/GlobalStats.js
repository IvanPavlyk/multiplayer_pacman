import React from 'react';
import Container from 'react-bootstrap/Container';

const GlobalStats = () => {
  return(
    <Container>
      <table className='table table-striped account-table'>
        <thead className='thead-dark'>
          <th scope='col'>GLOBAL STATS</th>
          <th scope='col'></th>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>All pellets eaten</th>
            <td>413,424</td>
          </tr>
          <tr>
            <th scope='row'>All players killed</th>
            <td>10,050</td>
          </tr>
        </tbody>
      </table>
    </Container>);
};

export default GlobalStats;