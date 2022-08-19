import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Album, Playlist, Agreement } from 'types'

export type State = {
  topAgreements: Agreement[] | null | MusicError
  topPlaylists: Playlist[] | null | MusicError
  topAlbums: Album[] | null | MusicError
}

export const initialState: State = {
  topAgreements: null,
  topPlaylists: null,
  topAlbums: null
}

export enum MusicError {
  ERROR = 'error'
}

type SetTopAgreements = { agreements: Agreement[] | MusicError }
type SetTopPlaylists = { playlists: Playlist[] | MusicError }
type SetTopAlbums = { albums: Album[] | MusicError }

const slice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setTopAgreements: (state, action: PayloadAction<SetTopAgreements>) => {
      const { agreements } = action.payload
      state.topAgreements = agreements
    },
    setTopPlaylists: (state, action: PayloadAction<SetTopPlaylists>) => {
      const { playlists } = action.payload
      state.topPlaylists = playlists
    },
    setTopAlbums: (state, action: PayloadAction<SetTopAlbums>) => {
      const { albums } = action.payload
      state.topAlbums = albums
    }
  }
})

export const { setTopAgreements, setTopPlaylists, setTopAlbums } = slice.actions

export default slice.reducer
