# React

## Components

**Prefix**: `tsrfc`

**Description**: Insert functional component

**Scope**: `typescript,typescriptreact`

```tsx
import { mc, StyleProps, TestIdProps } from '@/utils';
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


**Prefix**: `tsrfcs`

**Description**: Insert functional component simple version

**Scope**: `typescriptreact`

```tsx
import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';

type Props = StyleProps & TestIdProps;
// interface Props extends StyleProps, TestIdProps {
//   
// }

export const $1: FC<Props> = ({ testId, className, style }) => (
  <div data-testid={testId} className={mc(className)} style={style}>
    $0
  </div>
);

export default $1;
```

**Prefix**: `tsrip`

**Description**: Props

**Scope**: `typescriptreact`

```typescript
interface Props {
  $0
}
```

**Prefix**: `tsrus`

**Description**: Insert useState()

**Scope**: `typescriptreact`

```typescript
const [${1:name}, set${1/(.)(.*)/${1:/upcase}${2}/}] = useState<${3|boolean,boolean \| undefined,string,string \| undefined,number,number \| undefined,undefined|}>($0);
```

**Prefix**: `tsrue`

**Description**: Insert useEffect()

**Scope**: `typescriptreact`

```typescript
useEffect(() => {
  $0
}, [$1]);
```

**Prefix**: `tsrh`

**Description**: Insert handler

**Scope**: `typescriptreact`

```typescript
const handle$1 = ($2) => {
  $0
};
```