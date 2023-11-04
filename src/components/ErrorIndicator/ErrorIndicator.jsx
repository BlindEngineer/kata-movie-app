import { Space, Alert } from 'antd'

function ErrorIndicator({ message }) {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert message="Error" description={message} type="error" showIcon />
    </Space>
  )
}
export default ErrorIndicator
