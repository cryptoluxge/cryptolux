import LogoDisabled from 'assets/images/logo_disabled_dark.svg'

const index = ({ src, alt, ...rest }) => {
  const addDefaultSrc = (ev) => {
    ev.target.src = LogoDisabled
  }

  return (
    <img onError={addDefaultSrc} src={src} alt={alt} {...rest} />
  )
}

export default index