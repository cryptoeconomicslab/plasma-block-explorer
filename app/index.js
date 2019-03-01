import React  from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from './components/App';
import Explorer from './components/Explorer';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

let store = createStore(
  reducers,
  enhancer
);

class WrapperApp extends React.Component {
  render() {
    return (
      <div>
        <App>
          <Switch>
            <Redirect exact={true} from="/" to="/explorer"/>
            <Route path="/explorer" component={Explorer} />
          </Switch>
        </App>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <WrapperApp />
    </Router>
  </Provider>,
  document.getElementById('root')
);
