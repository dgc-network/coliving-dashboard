import Error from 'components/Error'
import Loading from 'components/Loading'
import Paper from 'components/Paper'
import React, { useCallback } from 'react'
import { useTopContentLists } from 'store/cache/music/hooks'
import { MusicError } from 'store/cache/music/slice'

import styles from './TopContentLists.module.css'

const messages = {
  title: 'Top ContentLists This Week'
}

type TopContentListsProps = {}

const TopContentLists: React.FC<TopContentListsProps> = () => {
  const { topContentLists } = useTopContentLists()
  const goToUrl = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  const renderTopContentLists = () => {
    if (topContentLists === MusicError.ERROR) return <Error />
    return !!topContentLists ? (
      topContentLists!.map((p, i) => (
        <div key={i} className={styles.content list} onClick={() => goToUrl(p.url)}>
          <div
            className={styles.artwork}
            style={{
              backgroundImage: `url(${p.artwork})`
            }}
          />
          <div className={styles.text}>
            <div className={styles.content listTitle}>{p.title}</div>
            <div className={styles.handle}>{p.handle}</div>
          </div>
        </div>
      ))
    ) : (
      <Loading className={styles.loading} />
    )
  }
  return (
    <Paper className={styles.container}>
      <div className={styles.title}>{messages.title}</div>
      <div className={styles.content lists}>{renderTopContentLists()}</div>
    </Paper>
  )
}

export default TopContentLists
