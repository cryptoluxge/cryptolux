import PropTypes from 'prop-types'
import { ImSpinner2 } from 'react-icons/im'

const Index = ({ color, loading, textColor, contained, children, className = '', ...rest }) => {
  return (
    <div>
      {contained ? (
        <button
          {...rest}
          className={`border-[1px] border-darkButton px-4 py-2 text-darkButton hover:text-black rounded-lg duration-150 w-full hover:bg-primary disabled:bg-gray-500 disabled:text-gray-700 disabled:cursor-not-allowed disabled:border-0 ${className}`}>
          {children}
        </button>
      ) : (
        <div>
          {!loading ? (
            <button {...rest} className={`bg-primary text-white px-4 py-2 w-full rounded-lg duration-200 hover:bg-primary/70 disabled:bg-gray-500 disabled:text-gray-700 disabled:cursor-not-allowed ${className}`}>
              {children}
            </button>
          ) : (
            <button
              disabled={true}
              {...rest}
              className={`bg-primary px-4 py-2 w-full rounded-lg duration-200 hover:bg-primary/70 disabled:bg-gray-500 disabled:text-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}>
              <ImSpinner2 className='animate-spin' />
              {children}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Index.defaultProps = {
  color: 'darkButton',
  textColor: 'white',
}

Index.propTypes = {
  title: PropTypes.string,
  textColor: PropTypes.string,
}

export default Index
