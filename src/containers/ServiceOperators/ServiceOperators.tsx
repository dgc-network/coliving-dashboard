import React from 'react'

import Page from 'components/page'
import TopOperatorsTable from 'components/topOperatorsTable'
import { SERVICES_TITLE, SERVICES } from 'utils/routes'

const messages = {
  title: 'ALL SERVICE OPERATORS'
}

type OwnProps = {}

type ServiceOperatorsProps = OwnProps
const ServiceOperators: React.FC<ServiceOperatorsProps> = () => {
  return (
    <Page
      title={messages.title}
      defaultPreviousPage={SERVICES_TITLE}
      defaultPreviousPageRoute={SERVICES}
    >
      <TopOperatorsTable />
    </Page>
  )
}

export default ServiceOperators
