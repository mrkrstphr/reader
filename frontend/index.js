import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './Layout';

const HomePage = lazy(() => import('./pages/Home'));
const SeriesPage = lazy(() => import('./pages/Series'));
const IssueDetailsPage = lazy(() => import('./pages/IssueDetails'));
const IssueReaderPage = lazy(() => import('./pages/IssueReader'));

const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={null}>
            <Switch>
              <Route path="/" exact component={HomePage} />
              {/* <Route path="/issues" component={() => <><h2>Test!</h2><Link to="/">Home</Link></>} /> */}
              <Route path="/issue/:id/details" component={IssueDetailsPage} />
              <Route path="/issue/:id/read" component={IssueReaderPage} />
              <Route path="/series" component={SeriesPage} />
              {/* <Route path="/publishers" component={() => <><h2>Test!</h2><Link to="/">Home</Link></>} /> */}
              {/* <Route path="/story-lines" component={() => <><h2>Test!</h2><Link to="/">Home</Link></>} /> */}
              <Route path="*" component={() => <h1>404</h1>} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

const root = document.getElementById('root');
render(<App />, root);
