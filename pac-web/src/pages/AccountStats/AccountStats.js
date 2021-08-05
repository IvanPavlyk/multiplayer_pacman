import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';

const AccountStats = () => {
  return(
    <div className='container account-stats-accordian'>
      <Accordion defaultActiveKey='0'>
        <Card>
          <Card.Header className='custom-card-header'>
            <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                GAME 1 - WIN
            </Accordion.Toggle>
          </Card.Header>

          <Accordion.Collapse eventKey='0'>
            <Card.Body className='card-body'>
              <table className='table table-striped'>
                <tbody>
                  <tr>
                    <th scope='row'>PLAYERS</th>
                    <td>TheLegend42, Bob, Dave, Jeff</td>
                  </tr>
                  <tr>
                    <th scope='row'>SCORE</th>
                    <td>1,500</td>
                  </tr>
                </tbody>
              </table></Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>);
};

export default AccountStats;