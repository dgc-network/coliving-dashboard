import React from 'react'

import Page from 'components/page'
import TopAddressesTable from 'components/topAddressesTable'
import { SERVICES_TITLE, SERVICES } from 'utils/routes'

const messages = {
  title: 'ALL USERS'
}

type OwnProps = {}

type ServiceUsersProps = OwnProps
const ServiceUsers: React.FC<ServiceUsersProps> = () => {
  return (
    <Page
      title={messages.title}
      defaultPreviousPage={SERVICES_TITLE}
      defaultPreviousPageRoute={SERVICES}
    >
      <TopAddressesTable />
    </Page>
  )
}

export default ServiceUsers
