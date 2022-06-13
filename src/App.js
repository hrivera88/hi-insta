import "./App.css";
// import React, { Suspense } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Queue from"./pages/threads";
import ChatView  from "./pages/chat";
import MonitorView from "./pages/monitor-chat";
const history = createBrowserHistory();

function App() {
  const routes = [
    { path: '/:instant_token', name: 'Home', Component: Queue },
    { path: '/ChatView/:org_name/:thread_id', name: 'ChatView', Component: ChatView },
    { path: '/MonitorView/:org_name/:thread_id', name: 'MonitorView', Component: MonitorView }
  ]
  return (
    <Router history={history}>
      <Switch>
        {routes.map(({ path, Component , name}) => (
          <Route
          key={path}
          exact
          path={path}
          render={(routeProps) => (       
              <Component {...routeProps}/>
          )}
          />
        ))}
      </Switch>
    </Router>
  );
}

export default App;
