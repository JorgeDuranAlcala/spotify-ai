
import PropTypes from 'prop-types'

export default function Box({ children, className, ...rest }) {
  return (
    <div className={`${"bg-black text-white p-4 rounded-lg "}${className}`} {...rest}>
      {children}
    </div>
  )
}

Box.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}