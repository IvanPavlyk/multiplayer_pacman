import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Room = () => {
    const [text, setText] = useState('');

    return (
      <div>
        <Link to='/login'>To Login</Link>
        <Link to='/room'>To Room</Link>
      </div>
    );
};

export default Room;
