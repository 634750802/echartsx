import React, { FC, PropsWithChildren, useRef } from 'react';


const Once: FC<PropsWithChildren<any>> = function Once ({ children }) {
  return useRef(children).current
}

Once.displayName = 'Once'

export default Once
