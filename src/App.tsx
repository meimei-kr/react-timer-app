import { useReducer, useEffect } from 'react'
import styled from '@emotion/styled'
import useSound from 'use-sound'
import beepSound from './sounds/beep.mp3'
import Input from './components/Input'
import Button from './components/Button'

const SInputs = styled.div`
  display: flex;
  justify-content: space-between;
`

const STimer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 2rem;
  margin: 20px auto;
`

const SButtons = styled.div`
  display: flex;
  justify-content: space-around;
`

const SErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
  text-align: center;
`

const initialState = {
  inputMinutes: 0,
  inputSeconds: 0,
  totalSeconds: 0,
  isRunning: false,
  errors: []
}

type State = {
  inputMinutes: number
  inputSeconds: number
  totalSeconds: number
  isRunning: boolean
  errors: string[]
}

type Action = 
  | { type: "SET_MINUTES"; payload: number  }
  | { type: "SET_SECONDS"; payload: number  }
  | { type: "SET_TOTAL_SECONDS"; payload: number  }
  | { type: "SET_IS_RUNNING"; payload: boolean  }
  | { type: "SET_ERRORS"; payload: string[] }
  | { type: "RESET" }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_MINUTES":
      return { ...state, inputMinutes: action.payload }
    case "SET_SECONDS":
      return { ...state, inputSeconds: action.payload }
    case "SET_TOTAL_SECONDS":
      return { ...state, totalSeconds: action.payload }
    case "SET_IS_RUNNING":
      return { ...state, isRunning: action.payload }
    case "SET_ERRORS":
      return { ...state, errors: action.payload }
    case "RESET":
      return { ...initialState }
    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { inputMinutes, inputSeconds, totalSeconds, isRunning, errors } = state

  const [play] = useSound(beepSound, { volume: 0.5 })

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const handleStart = () => {
    let newErrors: string[] = []
    if (inputMinutes < 0 || inputMinutes > 59 ) {
      newErrors.push('分は0〜59の数値を入力してください')
    }
    if (inputSeconds < 0 || inputSeconds > 59 ) {
      newErrors.push('秒は0〜59の数値を入力してください')
    }
    if (newErrors.length > 0) {
      dispatch({ type: "SET_ERRORS", payload: newErrors })
      return
    }
    dispatch({ type: "SET_ERRORS", payload: [] })
    dispatch({ type: 'SET_TOTAL_SECONDS', payload: inputMinutes * 60 + inputSeconds });
    dispatch({ type: 'SET_IS_RUNNING', payload: true });
  }

  const handleStop = () => {
    dispatch({ type: "SET_IS_RUNNING", payload: false })
  }

  const handleReset = () => {
    dispatch({ type: "RESET" })
  }

  const handleMinutesChange = (minutes: number) => {
    dispatch({ type: "SET_MINUTES", payload: minutes })
    if (!isRunning) {
      dispatch({ type: "SET_TOTAL_SECONDS", payload: minutes * 60 + inputSeconds })
    }
  }

  const handleSecondsChange = (seconds: number) => {
    dispatch({ type: "SET_SECONDS", payload: seconds })
    if (!isRunning) {
      dispatch({ type: "SET_TOTAL_SECONDS", payload: inputMinutes * 60 + seconds })
    }
  }

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        dispatch({ type: "SET_TOTAL_SECONDS", payload: totalSeconds - 1 })
      }, 1000)
    } else if (isRunning && totalSeconds === 0) {
      play()
      clearInterval(interval)
      dispatch({ type: "RESET" })
    }

    return () => {
      if (interval !== undefined) {
        clearInterval(interval)
      }
    }
  }, [isRunning, totalSeconds])

  return (
    <div>
      <SInputs>
        <Input onChange={handleMinutesChange} value={inputMinutes} label="分" />
        <Input onChange={handleSecondsChange} value={inputSeconds} label="秒" />
      </SInputs>
      <STimer>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </STimer>
      <SButtons>
        <Button handleClick={handleStart}>スタート</Button>
        <Button handleClick={handleStop}>一時停止</Button>
        <Button handleClick={handleReset}>リセット</Button>
      </SButtons>
      {errors.length > 0 && errors.map((error, index) => <SErrorMessage key={index}>{error}</SErrorMessage>)}
    </div>
  )
}

export default App