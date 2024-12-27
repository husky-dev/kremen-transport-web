# React

## Components

**Prefix**: `tsrfc`

**Description**: Insert functional component

**Scope**: `typescript,typescriptreact`

```tsx
import { mc, StyleProps } from '@/styles';
import { TestIdProps } from '@/utils';
import React, { FC } from 'react';

type Props = StyleProps & TestIdProps;
// interface Props extends StyleProps, TestIdProps {
//   
// }

export const $1: FC<Props> = ({ testId, className, style }) => {
  return (
    <div data-testid={testId} className={mc(className)} style={style}>
      $0
    </div>
  )
}

export default $1;
```
