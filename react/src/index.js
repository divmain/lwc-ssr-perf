import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Component from './Component';

export default (remaining) => ReactDOMServer.renderToString(<Component remaining={remaining} />);
