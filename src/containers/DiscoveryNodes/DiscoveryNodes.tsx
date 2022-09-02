import React from 'react'

import styles from './DiscoveryNodes.module.css'
import Page from 'components/Page'
import DiscoveryTable from 'components/DiscoveryTable'
import { SERVICES, SERVICES_TITLE } from 'utils/routes'

const messages = {
  title: 'Discovery Nodes'
}

type OwnProps = {}
type DiscoveryNodesProps = OwnProps

const DiscoveryNodes: React.FC<DiscoveryNodesProps> = () => {
  return (
    <Page
      title={messages.title}
      className={styles.container}
      defaultPreviousPage={SERVICES_TITLE}
      defaultPreviousPageRoute={SERVICES}
    >
      <DiscoveryTable className={styles.serviceTable} />
    </Page>
  )
}

export default DiscoveryNodes
