import React from 'react';

const PacmanIcon = ({ color, ...rest }) => {
	return (
		<svg fill="none" width='40' height='40' viewBox="0 0 31 34" {...rest}>
		  <defs/>
		  <path fill={color || "#FFF001"} d="M7.3892 0H20.25v2.6997h5.0864v2.6997h2.4385v5.114h2.5239v13.0811h-2.5239V28.02h-2.4385v2.6997H20.25v2.6997H7.3892v-2.6997H2.6206V28.02H0v-4.4255h5.059v-2.6997h7.3892v-2.6997h5.2305v-2.2823h-5.2305v-2.6997H5.0591v-2.6997H0v-5.114h2.6206V2.6997h4.7686V0z"/>
		</svg>
	)
};

export default PacmanIcon;