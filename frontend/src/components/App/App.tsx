import { memo, Suspense } from 'react';

import { TreeRoot } from '../TreeRoot/TreeRoot';

export default memo(
  function App() {
    return (
      <Suspense fallback={<p>Загрузка ...</p>}>
        <TreeRoot />
      </Suspense>
    )
  },
);
