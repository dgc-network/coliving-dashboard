import { ApolloProvider } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Provider, useSelector } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router'
import { createHashHistory } from 'history'

import Header from 'components/header'
import Home from 'containers/home'
import Governance from 'containers/governance'
import Services from 'containers/services'
import Node from 'containers/node'
import User from 'containers/user'
import DiscoveryNodes from 'containers/discoveryNodes'
import ContentNodes from 'containers/contentNodes'
import ServiceOperators from 'containers/serviceOperators'
import ServiceUsers from 'containers/serviceUsers'
import Analytics from 'containers/analytics'
import API from 'containers/api'
import APILeaderboard from 'containers/apiLeaderboard'
import * as routes from 'utils/routes'

import { client, getBackupClient, createStore } from './store'
import desktopStyles from './App.module.css'
import mobileStyles from './AppMobile.module.css'
import NotFound from 'containers/notFound'
import Proposal from 'containers/proposal'
import { createStyles } from 'utils/mobile'
import { getDidGraphError } from 'store/api/hooks'
const styles = createStyles({ desktopStyles, mobileStyles })
const history = createHashHistory()
const store = createStore(history)

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const App = () => {
  //  If the client fails, set it to the backup client
  const [appolloClient, setApolloClient] = useState(client)
  const didClientError = useSelector(getDidGraphError)
  useEffect(() => {
    if (didClientError) {
      const backupClient = getBackupClient()
      if (backupClient) {
        setApolloClient(backupClient)
      }
    }
  }, [didClientError])
  return (
    <Provider store={store}>
      <ApolloProvider client={appolloClient}>
        <ConnectedRouter history={history}>
          <div className={styles.appContainer}>
            <Header />
            <div className={styles.appContent}>
              <Switch>
                <Route path={routes.HOME} exact component={Home} />
                <Route path={routes.SERVICES} exact component={Services} />
                <Route
                  path={routes.SERVICES_DISCOVERY_PROVIDER}
                  exact
                  component={DiscoveryNodes}
                />
                <Route
                  path={routes.SERVICES_DISCOVERY_PROVIDER_NODE}
                  exact
                  component={Node}
                />
                <Route
                  path={routes.SERVICES_CONTENT}
                  exact
                  component={ContentNodes}
                />
                <Route
                  path={routes.SERVICES_CONTENT_NODE}
                  exact
                  component={Node}
                />
                <Route
                  path={routes.SERVICES_SERVICE_PROVIDERS}
                  exact
                  component={ServiceOperators}
                />
                <Route
                  path={routes.SERVICES_USERS}
                  exact
                  component={ServiceUsers}
                />
                <Route
                  path={routes.SERVICES_ACCOUNT_USER}
                  exact
                  component={User}
                />
                <Route
                  path={routes.SERVICES_ACCOUNT_OPERATOR}
                  exact
                  component={User}
                />
                <Route path={routes.GOVERNANCE} exact component={Governance} />
                <Route
                  path={routes.GOVERNANCE_PROPOSAL}
                  exact
                  component={Proposal}
                />
                <Route path={routes.ANALYTICS} exact component={Analytics} />
                <Route path={routes.API} exact component={API} />
                <Route
                  path={routes.API_LEADERBOARD}
                  exact
                  component={APILeaderboard}
                />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </ConnectedRouter>
      </ApolloProvider>
    </Provider>
  )
}

export default Root
