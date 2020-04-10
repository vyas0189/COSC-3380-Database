// import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore, StoreProvider } from 'easy-peasy';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import model from './store';

const store = createStore(model)

ReactDOM.render(<StoreProvider store={store}><Router> <App /></Router></StoreProvider>, document.getElementById('root'));