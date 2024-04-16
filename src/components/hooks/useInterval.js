import { useEffect, useRef } from 'react'

const useInterval = (props) => {
  const savedCallback = useRef()
  const intervalRef = useRef(null)

  const stopInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    savedCallback.current = props.callback
  }, [props.callback])

  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }

    if (props.delay !== null) {
      intervalRef.current = setInterval(tick, props.delay)
      return () => stopInterval()
    }
  }, [props.delay])
}

export default useInterval
