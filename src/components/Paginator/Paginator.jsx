import { Pagination } from 'antd'
import './Paginator.css'

function Paginator({ currentPage, onChange, totalPages }) {
  return (
    <div className="paginator">
      <Pagination
        defaultCurrent={1}
        showSizeChanger={false}
        pageSize={20}
        current={currentPage}
        onChange={onChange}
        total={totalPages * 20}
      />
    </div>
  )
}
export default Paginator
