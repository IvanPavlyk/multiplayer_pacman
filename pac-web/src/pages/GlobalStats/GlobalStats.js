import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';

const GlobalStats = () => {
  const [globalStats, setGlobalStats] = useState({});

  useEffect( () => {
    axios.get('http://localhost:3002/globalStats')
      .then( res => {
        console.log(res);
        setGlobalStats(res.data[0]);
      });
  }, []);
  return(
    <Container>
      <table className='table table-striped account-table'>
        <thead className='thead-dark'>
          <th scope='col'>GLOBAL STATS</th>
          <th scope='col'></th>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>Total Pellets Eaten</th>
            <td>{globalStats.pelletseaten}</td>
          </tr>
          <tr>
            <th scope='row'>Total Games Played</th>
            <td>{globalStats.gamesplayed}</td>
          </tr>
          <tr>
            <th scope='row'>Total Ghosts Eaten</th>
            <td>{globalStats.ghostseaten}</td>
          </tr>
          <tr>
            <th scope='row'>Total Players Eaten</th>
            <td>{globalStats.playerseaten}</td>
          </tr>
        </tbody>
      </table>
    </Container>);
};

export default GlobalStats;