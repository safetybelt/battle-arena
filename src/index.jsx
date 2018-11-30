import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import createHistory from 'history/createHashHistory';
import reducers from 'reducers';
import { routes } from 'utils';
import App from './app';

const history = createHistory();

const middleware = [thunk, routerMiddleware(history)];
let composeEnhancers = compose;

middleware.push(createLogger({}));
composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  // eslint-disable-line no-underscore-dangle

const store = createStore(
    combineReducers(Object.assign({}, reducers, { router: routerReducer })),
    composeEnhancers(applyMiddleware(...middleware))
);


function getContainer(Component) {
    return (
        <AppContainer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Component>
                        <Switch>
                            {routes.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    exact={route.path === '/'}
                                    component={route.component}
                                />
                            ))}
                            <Route render={() => <Redirect to="/" />}/>
                        </Switch>
                    </Component>
                </ConnectedRouter>
            </Provider>
        </AppContainer>
    );
}

render(getContainer(App), document.querySelector('#app'));

if (module.hot) {
    module.hot.accept('./app', () => {
        const App = require('./app').default;
        render(getContainer(App), document.querySelector('#app'));
    });
}
