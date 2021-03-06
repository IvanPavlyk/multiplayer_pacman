import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';

import './matches.scss';

const AccountStats = () => {
  const [matches, setMatches] = useState([]);

  useEffect( () => {
    const id = sessionStorage.getItem('id');
    axios.get(`http://localhost:3002/match-history/${id}`)
      .then( res => {
        setMatches(res.data);
      });
  }, []);

  const getMatchCards = () => {
    
    let gameNumber = 1;
    const matchList = matches.map( match => {
      return (
        <Accordion defaultActiveKey='0' key={match?.id}>
          <Card>
            <Card.Header className='custom-card-header'>
              <Accordion.Toggle as={Button} className='card-header-text' variant='link' eventKey='0'>
                GAME {gameNumber++}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body className='card-body'>
                <table className='table'>
                  <tbody>
                    <tr>
                      <th scope='row'>PELLETS EATEN</th>
                      <td>{match.pelletsEaten}</td>
                    </tr>
                    <tr>
                      <th scope='row'>GHOSTS EATEN</th>
                      <td>{match.ghostsEaten}</td>
                    </tr>
                    <tr>
                      <th scope='row'>PLAYERS EATEN</th>
                      <td>{match.playersEaten}</td>
                    </tr>
                    <tr>
                      <th scope='row'>POWER-UPS EATEN</th>
                      <td>{match.powerupsEaten}</td>
                    </tr>
                  </tbody>
                </table></Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    }).reverse();

    if(matchList.length < 1){
      return <h1 className='match-history-text'>No games played.</h1>;
    } else {
      return matchList;
    }
  };

  return(<div className='container account-stats-accordian'>
    {getMatchCards()}
  </div>
  );
};

export default AccountStats;