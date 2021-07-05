import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Room = () => {
    const [text, setText] = useState('');

    return (
      <div>
        <Link to='/login'>To Login</Link>
      </div>
    );
};

export default Room;
