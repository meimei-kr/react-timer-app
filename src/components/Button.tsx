import styled from "@emotion/styled"

const SButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #1785fc;
  }
`

type ButtonProps = {
  handleClick: () => void
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ handleClick, children }) => {
  return (
    <SButton onClick={handleClick}>{children}</SButton>
  )
}

export default Button