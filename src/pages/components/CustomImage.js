import Image from 'next/image';
import React from 'react';

const CustomImage = ({alt="image", ...props}) => {
    const [src, setSrc] = React.useState(props?.src || '');
    const shouldShowPlaceholder = props?.width < 40 || props?.height < 40; 
    return (
      <Image
        {...props}
        src={props?.src || src}
        alt={alt} // To fix lint warning 
        onError={() => setSrc('/images/error-img.png')}
        {...(shouldShowPlaceholder ? {} : { placeholder: 'blur' })}
        blurDataURL="/images/loading.svg"
        // className='agent-common-pic'
      />
    );
  }
  export default CustomImage