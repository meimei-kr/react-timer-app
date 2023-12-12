import styled from "@emotion/styled"

const SInput = styled.input`
  width: 40%;
`

type InputProps = {
  value: number
  onChange: (value: number) => void
  label: string
}

const Input: React.FC<InputProps> = ({ value, onChange, label }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value)
    if (newVal >= 0) {
      onChange(newVal)
    }
  }

  return (
    <>
      <SInput type="number" onChange={handleChange} value={value} />
      {label}
    </>
  )
}

export default Input