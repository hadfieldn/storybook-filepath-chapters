import React from 'react';

const Button1 = (props) => <button>{props.children}</button>;
Button1.propTypes = { children: React.PropTypes.object };

export default Button1;
