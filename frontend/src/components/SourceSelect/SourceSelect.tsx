import React, { memo, useCallback, ChangeEvent } from 'react';
import type { Node } from '../../renderTree/types';
import { URL_LABEL, EXT_LOAD_LABEL } from '../const';;

interface SourceSelectProps {
  value: string;
  items: Record<string, readonly Readonly<Node>[]>;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}

export const SourceSelect = memo(
  function SourceSelect({ value, items, onChange }: SourceSelectProps) {
    const changeHandler = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      const key = event.target.value;

      if (key === URL_LABEL) {
        const url = prompt('Paste the url to load:');
        if (!url) return;

        fetch(url)
          .then((resp) => resp.json())
          .then((data) => Array.isArray(data) && onChange(key, data))
          .catch(() => {});
      } else if (key === EXT_LOAD_LABEL) {
        const backUrl = "http://localhost:8080/web/api/v1/tree"
        fetch(backUrl, {
          method: "POST",
          body: JSON.stringify({id:1}),
          headers:{
            "Content-Type": "application/json",
          }
        })
          .then((resp) => resp.json())
          .then((data) => Array.isArray(data) && onChange(key, data))
          .catch(() => {});
      }
      else {
        onChange(key, items[key]);
      }
    }, [items, onChange]);

    return (
      <select value={value} onChange={changeHandler}>
        {Object.keys(items).map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
        <option value={URL_LABEL}>{URL_LABEL}</option>
        <option value={EXT_LOAD_LABEL}>{EXT_LOAD_LABEL}</option>
      </select>
    );
  },
);
