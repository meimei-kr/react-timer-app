import { useState, useEffect } from 'react'
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

const App = () => {
  const [inputMinutes, setInputMinutes] = useState<number>(0)
  const [inputSeconds, setInputSeconds] = useState<number>(0)
  const [totalSeconds, setTotalSeconds] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const [play] = useSound(beepSound, { volume: 0.5 })

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  let initialTotalSeconds = 0

  const handleStart = () => {

    let newErrors: string[] = []
    if (inputMinutes < 0 || inputMinutes > 59 ) {
      newErrors.push('分は0〜59の数値を入力してください')
    }
    if (inputSeconds < 0 || inputSeconds > 59 ) {
      newErrors.push('秒は0〜59の数値を入力してください')
    }
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors([])
    setTotalSeconds(inputMinutes * 60 + inputSeconds)
    initialTotalSeconds = totalSeconds
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setTotalSeconds(0)
    setIsRunning(false)
    setInputMinutes(0)
    setInputSeconds(0)
  }

  const handleMinutesChange = (minutes: number) => {
    setInputMinutes(minutes)
    if (!isRunning) {
      setTotalSeconds(minutes * 60 + inputSeconds)
    }
  }

  const handleSecondsChange = (seconds: number) => {
    setInputSeconds(seconds)
    if (!isRunning) {
      setTotalSeconds(inputMinutes * 60 + seconds)
    }
  }

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds(prevTotalSeconds => prevTotalSeconds - 1)
      }, 1000)
    } else if (isRunning && totalSeconds === 0) {
      play()
      clearInterval(interval)
      setTotalSeconds(0)
      setIsRunning(false)
      setInputMinutes(0)
      setInputSeconds(0)
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
      {errors && errors.map(error => <SErrorMessage>{error}</SErrorMessage>)}
    </div>
  )
}

export default App