import React, { useEffect, useReducer, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Spin } from 'antd'
import Axios from 'axios'
import Header from './components/Header'
import StateContext from './context/StateContext'
import DispatchContext from './context/DispatchContext'
import io from 'socket.io-client'

const connectionOptions = {
  'force new connection': true,
  reconnectionAttempts: 'Infinity', //avoid having user reconnect manually in order to prevent dead clients after a server restart
  timeout: 10000, //before connect_error and connect_timeout are emitted.
  transports: ['websocket'],
}

const socket = io(process.env.REACT_APP_BACKEND, connectionOptions)

Axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3001/api/'
const Grid = lazy(() => import('./components/Grid'))
const CreateBook = lazy(() => import('./components/CreateBook'))
const Detail = lazy(() => import('./components/Detail'))

const App = () => {
  // const [currentPage, setCurrentPage] = useState(1)
  // const [loadMore, setLoadMore] = useState(false)
  const mainRef = useRef()
  const bottomLineRef = useRef()
  const initialState = {
    books: [],
    queryString: 'books?sort=createdAt',
    currentPage: 1,
    currentSort: 'createdAt',
    currentNav: '',
  }

  const appReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'loadInitialBooks':
        return { ...state, books: action.value }
      case 'changeFilter':
        return { ...state, queryString: action.value.queryString, currentPage: 1, currentSort: action.value.currentSort, currentNav: action.value.currentNav }
      case 'changePage':
        return { ...state, currentPage: action.value }
      case 'loadMoreBooks':
        return { ...state, books: action.value }
      case 'addNewBookAtFirstPosition':
        return { ...state, books: [action.value, ...state.books] }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(appReducer, initialState)

  const fetchData = async () => {
    try {
      const response = await Axios.get(state.queryString)
      dispatch({ type: 'loadInitialBooks', value: response.data.data.data })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    socket.on('addNewBook', (book) => {
      dispatch({ type: 'addNewBookAtFirstPosition', value: book })
    })
  }, [state.currentNav])

  useEffect(() => {
    const handleScroll = () => {
      const containerHeight = mainRef?.current?.getBoundingClientRect()?.height
      const bottomLineTop = bottomLineRef?.current?.getBoundingClientRect()?.top
      if (bottomLineTop <= containerHeight) {
        dispatch({ type: 'changePage', value: state.currentPage + 1 })
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [state.currentPage])

  useEffect(() => {
    const autoLoadMore = async () => {
      const sortQuery = `sort=${state.currentSort}`
      const typeQuery = state.currentNav === 'all' ? '' : `type=${state.currentNav}`
      const pageQuery = `page=${state.currentPage}`
      const response = await Axios.get(`books?${sortQuery}&${typeQuery}&${pageQuery}`)
      dispatch({ type: 'loadMoreBooks', value: response.data.data.data })
    }
    autoLoadMore()
  }, [state.currentPage, state.currentNav, state.currentSort])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Switch>
            <Suspense
              fallback={
                <div style={{ textAlign: 'center', margin: '50px' }}>
                  <Spin />
                </div>
              }>
              <Route path='/' exact>
                <div style={{ height: '100vh', padding: '20px' }} ref={mainRef}>
                  <Header />
                  <Grid refetchData={fetchData} />
                  <div ref={bottomLineRef} />
                </div>
              </Route>
              <Route path='/createBook' exact>
                <CreateBook />
              </Route>
              <Route path='/detail/:id' exact>
                <Detail refetchData={fetchData} />
              </Route>
            </Suspense>
          </Switch>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
